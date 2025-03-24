import { Injectable } from '@nestjs/common';

import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { ScraperCatalogService } from './scarper-telemart-catalog.service';

@Injectable()
export class ScraperServiceFactory {
  constructor(
    private readonly telemartScraperService: ScraperTelemartService,
    private readonly rozetkaScraperService: ScraperRozetkaService,
    private readonly catalogScraperService: ScraperCatalogService,
  ) {}

  createService(serviceType: string) {
    switch (serviceType) {
      case 'telemart':
        return this.telemartScraperService;
      case 'rozetka':
        return this.rozetkaScraperService;
      case 'catalog':
        return this.catalogScraperService;
      default:
        throw new Error('Invalid service type');
    }
  }
}
