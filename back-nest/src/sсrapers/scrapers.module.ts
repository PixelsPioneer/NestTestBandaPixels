import { Module } from '@nestjs/common';

import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperController } from './scrapers.controller';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { ProductService } from '../products/products.services';

@Module({
  controllers: [ScraperController],
  providers: [ScraperTelemartService, ScraperRozetkaService, ProductService],
})
export class ScraperModule {}
