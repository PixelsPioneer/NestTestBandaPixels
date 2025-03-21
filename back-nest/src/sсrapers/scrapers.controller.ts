import { Controller, Get, HttpCode, Logger } from '@nestjs/common';

import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { ScraperCatalogService } from './scarper-telemart-catalog.service';
import { ScrapedCategoryDto } from '../dto/catalogCategories.dto';

@Controller('scraper')
export class ScraperController {
  private readonly logger = new Logger(ScraperController.name);

  constructor(
    private readonly telemartScraperService: ScraperTelemartService,
    private readonly rozetkaScraperService: ScraperRozetkaService,
    private readonly catalogScraperService: ScraperCatalogService,
  ) {}

  @HttpCode(200)
  @Get('catalog')
  async catalogService(): Promise<ScrapedCategoryDto[]> {
    this.logger.log('Start to get catalog service...');
    const scrapedCatalog = await this.catalogScraperService.scrapeCategories();

    if (!scrapedCatalog || scrapedCatalog.length === 0) {
      this.logger.warn('No categories found in scraped catalog from Telemart.');
      return [];
    }
    return this.catalogScraperService.scrapeAndSaveCategories();
  }

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

    await this.telemartScraperService.scrapeAndSaveTelemartProducts();

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

    await this.rozetkaScraperService.scrapeAndSaveRozetkaProducts();

    return;
  }
}
