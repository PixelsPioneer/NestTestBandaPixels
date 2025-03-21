import { Module } from '@nestjs/common';

import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperController } from './scrapers.controller';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { ScraperCatalogService } from './scarper-telemart-catalog.service';
import { ProductModule } from '../products/products.module';
import { S3Service } from '../s3/s3.service';

@Module({
  imports: [ProductModule],
  controllers: [ScraperController],
  providers: [
    ScraperTelemartService,
    ScraperRozetkaService,
    ScraperCatalogService,
    S3Service,
  ],
})
export class ScraperModule {}
