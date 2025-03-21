import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { randomUUID } from 'crypto';

import { Sources } from './models/sources';
import { RedisService } from '../redis/redis.service';
import { ProductService } from '../products/products.services';
import { ScrapedProduct } from './models/scraped-product.model';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class ScraperTelemartService {
  private readonly logger = new Logger(ScraperTelemartService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly s3Service: S3Service,
    private readonly productService: ProductService,
  ) {}

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

  async scrapeAndSaveTelemartProducts(): Promise<void> {
    this.logger.log('Starting Telemart scraping...');
    const scrapedProducts = await this.scrapeTelemart();

    if (!scrapedProducts || scrapedProducts.length === 0) {
      this.logger.warn('No products were scraped from Telemart.');
      return;
    }

    this.logger.log(
      `Scraped ${scrapedProducts.length} products from Telemart.`,
    );

    const productsToUpsert: ScrapedProduct[] = [];

    for (const product of scrapedProducts) {
      if (product.profileImages?.length) {
        const productSerialNumber = product.title.match(/\(([^)]+)\)/);

        const productFolder =
          productSerialNumber?.[1] ||
          product.title.replace(/[^a-zA-Z0-9_-]/g, '_') ||
          randomUUID();

        const uploadedImageUrls = await Promise.all(
          product.profileImages.map(async (imageUrl, index) => {
            return await this.s3Service.uploadImage(
              imageUrl,
              `${productFolder}/${index}`,
            );
          }),
        );

        const images = uploadedImageUrls.filter(
          (url): url is string => url !== null,
        );

        await this.redisService.saveProductImages(productFolder, images);

        productsToUpsert.push({
          ...product,
          profileImages: images,
        });

        this.logger.log(
          `Uploaded ${product.profileImages.length} images for product ${product.title}`,
        );
      }
    }

    await this.productService.upsertProducts(productsToUpsert);

    this.logger.log(
      `Successfully processed ${scrapedProducts.length} products from ${Sources.Telemart}.`,
    );
  }
}
