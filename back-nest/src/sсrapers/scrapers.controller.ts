import { Controller, Param, Get, HttpCode } from '@nestjs/common';

import { ScraperGateway } from '../ws.getway';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperGateway: ScraperGateway) {}

  @HttpCode(204)
  @Get(':serviceType')
  async scrape(@Param('serviceType') serviceType: string): Promise<void> {
    this.scraperGateway.handleScraping(serviceType);
  }
}
