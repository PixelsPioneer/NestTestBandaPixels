import { Controller, Get, HttpCode, Logger } from '@nestjs/common';

import { ScraperServiceFactory } from './ScraperServiceFactory';
import { ScrapedCategoryDto } from '../dto/catalogCategories.dto';

@Controller('scraper')
export class ScraperController {
  private readonly logger = new Logger(ScraperController.name);

  constructor(private readonly scraperServiceFactory: ScraperServiceFactory) {}

  @HttpCode(200)
  @Get('catalog')
  async catalogService(): Promise<ScrapedCategoryDto[]> {
    const catalogScraperService =
      this.scraperServiceFactory.createService('catalog');

    if ('scrapeAndSaveCategories' in catalogScraperService) {
      return catalogScraperService.scrapeAndSaveCategories();
    }

    this.logger.error(
      'scrapeAndSaveCategories method is not available on this service.',
    );
    return [];
  }

  @HttpCode(204)
  @Get('scrape-telemart')
  async scrapeTelemart(): Promise<void> {
    const telemartScraperService =
      this.scraperServiceFactory.createService('telemart');

    if ('scrapeAndSaveTelemartProducts' in telemartScraperService) {
      await telemartScraperService.scrapeAndSaveTelemartProducts();
    } else {
      this.logger.error(
        'scrapeAndSaveTelemartProducts method is not available on this service.',
      );
      return;
    }
  }

  @HttpCode(204)
  @Get('scrape-rozetka')
  async scrapeRozetka(): Promise<void> {
    const rozetkaScraperService =
      this.scraperServiceFactory.createService('rozetka');

    if ('scrapeAndSaveRozetkaProducts' in rozetkaScraperService) {
      await rozetkaScraperService.scrapeAndSaveRozetkaProducts();
    } else {
      this.logger.error(
        'scrapeAndSaveRozetkaProducts method is not available on this service.',
      );
      return;
    }
  }
}
