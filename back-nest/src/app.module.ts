import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScraperService } from './scraperRozetka/scraper-rozetka.service';
import { ScraperController } from './scraperRozetka/scrapers.controller';
import { ScraperTelemartController } from './scraperTelemart/scraper-telemart.controller';
import { ScraperTelemartService } from './scraperTelemart/scraper-telemart.service';
import { ProductModule } from './getAllElement/get-all-element.module';
import { Product } from './models/product.enity.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'user',
      password: 'rootpassword',
      database: 'newschema',
      entities: [Product],
      synchronize: true,
    }),
    ProductModule,
    TypeOrmModule.forFeature([Product]),
  ],
  providers: [ScraperService, ScraperTelemartService], 
  controllers: [ScraperController, ScraperTelemartController],

})
export class AppModule {}
