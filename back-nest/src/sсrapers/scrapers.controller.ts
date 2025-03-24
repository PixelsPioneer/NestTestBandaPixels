import { Controller, Param, Get, HttpCode, Logger } from '@nestjs/common';

import { ScraperServiceFactory, ServiceType } from './ScraperServiceFactory';

@Controller('scraper')
export class ScraperController {
  private readonly logger = new Logger(ScraperController.name);

  constructor(private readonly scraperServiceFactory: ScraperServiceFactory) {}

  @HttpCode(204)
  @Get(':serviceType')
  async scrape(@Param('serviceType') serviceType: string): Promise<void> {
    const scraperService = this.scraperServiceFactory.createService(
      serviceType as ServiceType,
    );
    await scraperService.scrapeAndSave();
  }
}
