import { Module } from '@nestjs/common';

import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperController } from './scrapers.controller';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductService } from '../getAllElement/products.services';

@Module({
  controllers: [ScraperController],
  providers: [
    ScraperTelemartService,
    ScraperRozetkaService,
    PrismaService,
    ProductService,
  ],
})
export class ScraperModule {}
