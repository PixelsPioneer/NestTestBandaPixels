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
    return this.catalogScraperService.scrapeAndSaveCategories();
  }

  @HttpCode(204)
  @Get('scrape-telemart')
  async scrapeTelemart(): Promise<void> {
    await this.telemartScraperService.scrapeAndSaveTelemartProducts();
    return;
  }

  @HttpCode(204)
  @Get('scrape-rozetka')
  async scrapeRozetka(): Promise<void> {
    await this.rozetkaScraperService.scrapeAndSaveRozetkaProducts();
    return;
  }
}
