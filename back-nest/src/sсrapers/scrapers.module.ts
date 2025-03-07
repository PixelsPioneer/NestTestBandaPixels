import { Module } from '@nestjs/common';

import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperController } from './scrapers.controller';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { ProductModule } from '../products/products.module';

@Module({
  imports: [ProductModule],
  controllers: [ScraperController],
  providers: [ScraperTelemartService, ScraperRozetkaService],
})
export class ScraperModule {}
