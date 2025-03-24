import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';

import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { ScraperCatalogService } from './scarper-telemart-catalog.service';

export enum ServiceType {
  Telemart = 'telemart',
  Rozetka = 'rozetka',
  Catalog = 'catalog',
}

@Injectable()
export class ScraperServiceFactory {
  constructor(
    private readonly telemartScraperService: ScraperTelemartService,
    private readonly rozetkaScraperService: ScraperRozetkaService,
    private readonly catalogScraperService: ScraperCatalogService,
    private readonly logger = new Logger(ScraperServiceFactory.name),
  ) {}

  createService(
    type: ServiceType,
  ): ScraperCatalogService | ScraperTelemartService | ScraperRozetkaService {
    switch (type) {
      case ServiceType.Telemart:
        return this.telemartScraperService;
      case ServiceType.Rozetka:
        return this.rozetkaScraperService;
      case ServiceType.Catalog:
        return this.catalogScraperService;
      default:
        this.logger.error(`Invalid service type ${type}`);
        throw new InternalServerErrorException(`Invalid service type ${type}`);
    }
  }
}
