import { Controller, Get, HttpCode, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { ProductService } from '../products/products.services';
import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { Sources } from './models/sources';
import { S3Service } from '../s3/s3.service';
import { ScrapedProduct } from './models/scraped-product.model';
import { RedisService } from '../redis/redis.service';

@Controller('scraper')
export class ScraperController {
  private readonly logger = new Logger(ScraperController.name);

  constructor(
    private readonly telemartScraperService: ScraperTelemartService,
    private readonly rozetkaScraperService: ScraperRozetkaService,
    private readonly productService: ProductService,
    private readonly s3Service: S3Service,
    private readonly redisService: RedisService,
  ) {}

  @HttpCode(204)
  @Get('scrape-telemart')
  async scrapeTelemart(): Promise<void> {
    this.logger.log('Starting Telemart scraping...');
    const scrapedProducts = await this.telemartScraperService.scrapeTelemart();

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

    return;
  }

  @HttpCode(204)
  @Get('scrape-rozetka')
  async scrapeRozetka(): Promise<void> {
    this.logger.log('Starting to scrape products from Rozetka...');

    const scrapedProducts =
      await this.rozetkaScraperService.scrapeRozetkaProducts();

    if (!scrapedProducts || scrapedProducts.length === 0) {
      this.logger.warn('No products were scraped from Rozetka.');
      return;
    }

    this.logger.log(`Scraped ${scrapedProducts.length} products from Rozetka.`);

    const productsToUpsert: ScrapedProduct[] = [];

    for (const product of scrapedProducts) {
      if (product.profileImages && product.profileImages.length > 0) {
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

    await this.productService.upsertProducts(scrapedProducts);

    this.logger.log(
      `Successfully processed ${scrapedProducts.length} products from ${Sources.Rozetka}`,
    );

    return;
  }
}
