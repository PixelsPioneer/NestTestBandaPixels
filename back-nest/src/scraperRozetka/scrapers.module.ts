import { Module } from '@nestjs/common';
import { ScraperController } from './scrapers.controller';
import { ScraperService } from './scraper-rozetka.service';

@Module({
  controllers: [ScraperController],
  providers: [ScraperService],
})
export class ScraperModule {}
