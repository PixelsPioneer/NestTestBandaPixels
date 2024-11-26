import { Controller, Get, Logger } from '@nestjs/common';
import { ScraperTelemartService } from './scraper-telemart.service';
import { Product } from '../models/product.enity.model';

@Controller('scraper')
export class ScraperTelemartController {
  private readonly logger = new Logger(ScraperTelemartController.name);

  constructor(private readonly scraperService: ScraperTelemartService) {}

  @Get('scrape-telemart')
  async scrapeTelemart(): Promise<Product[]> {
    try {
      this.logger.log('Starting Telemart scraping...');
      const products = await this.scraperService.scrapeTelemart();
      this.logger.log(`Successfully scraped ${products.length} products from Telemart.`);
      return products;
    } catch (error) {
      this.logger.error('Failed to scrape Telemart:', error);
      throw error;
    }
  }
}
