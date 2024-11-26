import { Controller, Get, Logger } from '@nestjs/common';
import { ScraperService } from './scraper-rozetka.service';
import { Product } from '../models/product.enity.model';

@Controller('scraper')
export class ScraperController {
  private readonly logger = new Logger(ScraperController.name);

  constructor(private readonly scraperService: ScraperService) {}

  @Get('scrape-rozetka')
  async scrapeRozetka(): Promise<Product[]> {
    try {
      this.logger.log('Starting to scrape products from Rozetka...');

      await this.scraperService.clearProducts();

      const scrapedProducts = await this.scraperService.scraperRozetka();
      this.logger.log(`Scraped ${scrapedProducts.length} products from Rozetka.`);

      await this.scraperService.saveProductsToDB(scrapedProducts, 'ROZETKA');

      return scrapedProducts;
    } catch (error) {
      this.logger.error('Failed to scrape Rozetka products:', error);
      throw error;
    }
  }
}
