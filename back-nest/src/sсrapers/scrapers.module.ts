import { Module } from '@nestjs/common';

import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperController } from './scrapers.controller';
import { ScraperRozetkaService } from './scraper-rozetka.service';

@Module({
  controllers: [ScraperController],
  providers: [ScraperTelemartService, ScraperRozetkaService],
})
export class ScraperModule {}
