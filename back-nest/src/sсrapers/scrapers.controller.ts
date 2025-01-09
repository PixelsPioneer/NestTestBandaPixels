import { Controller, Get, Logger } from '@nestjs/common';
import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { Product } from '../models/product.enity.model';
import { ResponseDto } from '../dto/response.dto';

@Controller('scraper')
export class ScraperController {
  private readonly logger = new Logger(ScraperController.name);

  constructor(
    private readonly telemartScraperService: ScraperTelemartService,
    private readonly rozetkaScraperService: ScraperRozetkaService,
  ) {}

  @Get('scrape-telemart')
  async scrapeTelemart(): Promise<Product[]> {
    this.logger.log('Starting Telemart scraping...');
    const products = await this.telemartScraperService.scrapeTelemart();
    this.logger.log(
      `Successfully scraped ${products.length} products from Telemart.`,
    );
    return products;
  }

  @Get('scrape-rozetka')
  async scrapeRozetka(): Promise<ResponseDto> {
    this.logger.log('Starting to scrape products from Rozetka...');

    const scrapedProducts = await this.rozetkaScraperService.scraperRozetka();

    if (!scrapedProducts || scrapedProducts.length === 0) {
      this.logger.warn('No products were scraped from Rozetka.');
      return {
        message: 'No products were scraped from Rozetka.',
        totalProducts: 0,
      };
    }

    this.logger.log(`Scraped ${scrapedProducts.length} products from Rozetka.`);

    await this.rozetkaScraperService.saveProductsToDB(scrapedProducts);

    this.logger.log(
      `Scraping and update and insert completed successfully. Total products processed: ${scrapedProducts.length}`,
    );

    return {
      message: 'Scraping and update and insert completed successfully.',
      totalProducts: scrapedProducts.length,
    };
  }
}
