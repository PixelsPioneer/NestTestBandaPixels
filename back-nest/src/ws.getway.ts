import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';

import {
  ScraperServiceFactory,
  ServiceType,
} from '../src/sсrapers/ScraperServiceFactory';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({ cors: true })
export class ScraperGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ScraperGateway.name);
  private isScraping = false;

  constructor(
    private readonly scraperServiceFactory: ScraperServiceFactory,
    private readonly prisma: PrismaService,
  ) {}

  @SubscribeMessage('startScraping')
  async handleScraping(@MessageBody() serviceType: string) {
    if (this.isScraping) {
      this.logger.warn(`Scraper is already running.`);
      this.server.emit('scrapingStatus', {
        message: `Another scraper is already running`,
      });
      return;
    }

    this.isScraping = true;
    this.server.emit('scrapingStatus', {
      message: `Scraping ${serviceType} was started`,
    });

    try {
      const scraperService = this.scraperServiceFactory.createService(
        serviceType as ServiceType,
      );

      if (!scraperService.scrapeAndSave) {
        throw new Error(
          `Scraper for ${serviceType} does not implement scrapeAndSave`,
        );
      }

      await scraperService.scrapeAndSave();

      const updatedProducts = await this.prisma.product.findMany({
        where: { source: `TELEMART` },
      });

      this.logger.log(`Send metadata:`, updatedProducts);

      this.server.emit('updateProductsMetadata', updatedProducts);

      this.server.emit('scrapingStatus', {
        message: `Scraping ${serviceType} was finished`,
      });
    } catch (error) {
      this.logger.error(`Error during scraping ${serviceType}:`, error);
      this.server.emit('scrapingStatus', {
        message: `Error scraping ${serviceType}`,
      });
    } finally {
      this.isScraping = false;
    }
  }
}
