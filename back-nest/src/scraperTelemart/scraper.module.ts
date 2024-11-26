import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperTelemartController } from './scraper-telemart.controller';
import { Product } from '../models/product.enity.model';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ScraperTelemartController],
  providers: [ScraperTelemartService],
})
export class ScraperModule {}
