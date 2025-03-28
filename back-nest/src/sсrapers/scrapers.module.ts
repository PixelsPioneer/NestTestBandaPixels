import { Module } from '@nestjs/common';

import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperController } from './scrapers.controller';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { ScraperCatalogService } from './scarper-telemart-catalog.service';
import { ScraperServiceFactory } from './ScraperServiceFactory';
import { ProductModule } from '../products/products.module';
import { ScraperGateway } from '../ws.gateway';
import { S3Service } from '../s3/s3.service';

@Module({
  imports: [ProductModule],
  controllers: [ScraperController],
  providers: [
    ScraperTelemartService,
    ScraperRozetkaService,
    ScraperCatalogService,
    ScraperServiceFactory,
    S3Service,
    ScraperGateway,
  ],
  exports: [ScraperServiceFactory],
})
export class ScraperModule {}
