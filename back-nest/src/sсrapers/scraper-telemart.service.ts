import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';

import { Sources } from './models/sources';
import { RedisService } from '../redis/redis.service';
import { ScrapedProduct } from './models/scraped-product.model';

@Injectable()
export class ScraperTelemartService {
  private readonly logger = new Logger(ScraperTelemartService.name);

  constructor(private readonly redisService: RedisService) {}

  async scrapeTelemart(): Promise<ScrapedProduct[]> {
    const url = 'https://telemart.ua/ua/pc/';
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    );
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    await page.evaluate(() => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach((img) => {
        if (img instanceof HTMLImageElement) {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
        }
      });
    });

    this.logger.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });

    await page.waitForSelector('.product-item__inner', { timeout: 30000 });

    this.logger.log('Extracting product data...');

    const rawProducts: ScrapedProduct[] = await page.evaluate((source) => {
      const items = Array.from(
        document.querySelectorAll('.product-item__inner'),
      );

      return items.map<ScrapedProduct>((element) => {
        const title =
          element
            .querySelector('.product-item__title a')
            ?.textContent?.trim() || 'No title available';

        const subtitle =
          element
            .querySelector('.product-item__title a')
            ?.getAttribute('href') || 'No subtitle available';

        const description =
          element
            .querySelector('.product-card__description')
            ?.textContent?.trim() || 'No description available';

        const specifications: Record<string, string> = {};

        Array.from(
          element.querySelectorAll('.product-short-char__item'),
        ).forEach((specElement) => {
          const label =
            specElement
              .querySelector('.product-short-char__item__label')
              ?.textContent?.trim() || 'Unknown';

          const value =
            specElement
              .querySelector('.product-short-char__item__value')
              ?.textContent?.trim() || 'Unknown';

          specifications[label] = value;
        });

        const type = element.getAttribute('data-prod-type') || 'Unknown type';

        const carouseActive = Array.from(
          element.querySelectorAll('.swiper-slide img'),
        )
          .map((img) => img.getAttribute('src')?.trim())
          .filter((src): src is string => !!src);

        const carouselImages = Array.from(
          element.querySelectorAll('.swiper-slide-next img'),
        )
          .map((img) => img.getAttribute('data-src')?.trim())
          .filter((dataSrc): dataSrc is string => !!dataSrc);

        const carouseLazy = Array.from(
          element.querySelectorAll('.swiper-slide img'),
        )
          .map((img) => img.getAttribute('data-src')?.trim())
          .filter((dataSrc): dataSrc is string => !!dataSrc);

        const profileImages = [
          ...carouseActive,
          ...carouselImages,
          ...carouseLazy,
        ];

        const footerColumn = element.querySelector(
          '.product-item__footer-column',
        );

        const rating = parseFloat(
          element.querySelector('.rate-item__total')?.textContent?.trim() ||
            '0',
        );

        const currentPrice =
          footerColumn?.querySelector('.product-cost')?.textContent?.trim() ||
          '0';

        const oldPrice =
          footerColumn
            ?.querySelector('.product-cost_old')
            ?.textContent?.trim() || null;

        const newPrice =
          footerColumn
            ?.querySelector('.product-cost_new')
            ?.textContent?.trim() || null;

        const parsedCurrentPrice =
          parseFloat(currentPrice.replace(/[^\d.-]/g, '')) || 0;
        const parsedOldPrice = oldPrice
          ? parseFloat(oldPrice.replace(/[^\d.-]/g, ''))
          : null;
        const parsedNewPrice = newPrice
          ? parseFloat(newPrice.replace(/[^\d.-]/g, ''))
          : null;

        const price = parsedOldPrice || parsedCurrentPrice;
        const hasDiscount = !!parsedOldPrice;

        return {
          title,
          subtitle,
          description,
          price,
          newPrice: hasDiscount ? parsedNewPrice : null,
          specifications: JSON.stringify(specifications),
          type,
          profileImages,
          hasDiscount,
          source,
          rating,
        };
      });
    }, Sources.Telemart);

    this.logger.log(
      `Found ${rawProducts.length} products. Saving to database...`,
    );

    await this.redisService.delete();
    this.logger.log('Redis cache cleared after saving products to DB.');

    await browser.close();

    return rawProducts;
  }
}
