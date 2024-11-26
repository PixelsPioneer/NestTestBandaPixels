import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperController } from './scrapers.controller';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { Product } from '../models/product.enity.model';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ScraperController],
  providers: [ScraperTelemartService, ScraperRozetkaService],
})
export class ScraperModule {}
