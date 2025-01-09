import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RedisService } from '../redis/redis.service';
import { Product } from '../models/product.enity.model';

@Injectable()
export class ScraperTelemartService {
  private readonly logger = new Logger(ScraperTelemartService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly redisService: RedisService,
  ) {}

  async scrapeTelemart(): Promise<Product[]> {
    const url = 'https://telemart.ua/ua/pc/';
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    );

    this.logger.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });

    await page.waitForSelector('.product-item__inner', { timeout: 30000 });

    this.logger.log('Extracting product data...');
    const rawProducts = await page.evaluate(() => {
      const items = Array.from(
        document.querySelectorAll('.product-item__inner'),
      );

      return items.map((element) => {
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

        const price = Number(element.getAttribute('data-price')) || 0;

        const specifications: { [key: string]: string } = {};

        element
          .querySelectorAll('.product-short-char__item')
          .forEach((specElement) => {
            const label =
              specElement
                .querySelector('.product-short-char__item__label')
                ?.textContent?.trim() || 'Unknown';

            specifications[label] =
              specElement
                .querySelector('.product-short-char__item__value')
                ?.textContent?.trim() || 'Unknown';
          });

        const type = element.getAttribute('data-prod-type') || 'Unknown type';

        const imageElement = element.querySelector(
          '.swiper-slide.swiper-slide-active img',
        );

        const profileImage = imageElement
          ? imageElement.getAttribute('src')
          : null;

        return {
          title,
          subtitle,
          description,
          price,
          specifications: JSON.stringify(specifications),
          type,
          profileImage,
          source: 'TELEMART',
        };
      });
    });

    this.logger.log(
      `Found ${rawProducts.length} products. Saving to database...`,
    );

    const products: Product[] = [];

    for (const rawProduct of rawProducts) {
      const existingProduct = await this.productRepository.findOne({
        where: { title: rawProduct.title, source: rawProduct.source },
      });

      if (!existingProduct) {
        const newProduct = this.productRepository.create({
          title: rawProduct.title,
          subtitle: rawProduct.subtitle,
          description: rawProduct.description,
          newPrice: rawProduct.price,
          specifications: rawProduct.specifications,
          type: rawProduct.type,
          profileImage: rawProduct.profileImage,
          source: rawProduct.source,
        });
        const savedProduct = await this.productRepository.save(newProduct);
        this.logger.log(`Created new product: ${savedProduct.title}`);
        products.push(savedProduct);
        return;
      }

      this.productRepository.merge(existingProduct, {
        subtitle: rawProduct.subtitle,
        description: rawProduct.description,
        newPrice: rawProduct.price,
        specifications: rawProduct.specifications,
        type: rawProduct.type,
        profileImage: rawProduct.profileImage,
      });

      const updatedProduct = await this.productRepository.save(existingProduct);
      this.logger.log(`Updated product: ${updatedProduct.title}`);
      products.push(updatedProduct);
    }

    await this.redisService.delete();
    this.logger.log('Redis cache cleared after saving products to DB.');

    await browser.close();
    return products;
  }
}
