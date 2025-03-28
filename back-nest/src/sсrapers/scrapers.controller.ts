import { Controller, Param, Post, HttpCode } from '@nestjs/common';

import { ScraperGateway } from '../ws.gateway';

@Controller('scraper')
export class ScraperController {
  constructor(private readonly scraperGateway: ScraperGateway) {}

  @HttpCode(204)
  @Post(':serviceType')
  async scrape(@Param('serviceType') serviceType: string): Promise<void> {
    return this.scraperGateway.handleScraping(serviceType);
  }
}
