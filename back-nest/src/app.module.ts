import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperRozetkaService } from './sсrapers/scraper-rozetka.service';
import { ScraperController } from './sсrapers/scrapers.controller';
import { ScraperTelemartService } from './sсrapers/scraper-telemart.service';
import { ProductModule } from './getAllElement/get-all-element.module';
import { Product } from './models/product.enity.model';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 1) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Product],
      synchronize: true,
    }),
    ProductModule,
    TypeOrmModule.forFeature([Product]),
  ],
  providers: [ScraperRozetkaService, ScraperTelemartService],
  controllers: [ScraperController],
})
export class AppModule {}