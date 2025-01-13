import { Controller, Get, HttpCode, Logger } from '@nestjs/common';
import { product as ProductType } from '@prisma/client';

import { ProductService } from '../getAllElement/products.services';
import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperRozetkaService } from './scraper-rozetka.service';

@Controller('scraper')
export class ScraperController {
  private readonly logger = new Logger(ScraperController.name);

  constructor(
    private readonly telemartScraperService: ScraperTelemartService,
    private readonly rozetkaScraperService: ScraperRozetkaService,
    private readonly productService: ProductService,
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

    await this.productService.upsertProducts(scrapedProducts);

    this.logger.log(
      `Successfully processed ${scrapedProducts.length} products from Telemart.`,
    );

    return;
  }

  @Get('scrape-rozetka')
  async scrapeRozetka(): Promise<ProductType[]> {
    this.logger.log('Starting to scrape products from Rozetka...');

    const scrapedProducts =
      await this.rozetkaScraperService.scrapeRozetkaProducts();

    if (!scrapedProducts || scrapedProducts.length === 0) {
      this.logger.warn('No products were scraped from Rozetka.');
      return [];
    }

    this.logger.log(`Scraped ${scrapedProducts.length} products from Rozetka.`);

    await this.productService.upsertProducts(scrapedProducts);

    this.logger.log(
      `Successfully processed ${scrapedProducts.length} products from Rozetka.`,
    );

    return;
  }
}
