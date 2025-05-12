import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import Redlock, { ExecutionError } from 'redlock';

import {
  ScraperServiceFactory,
  ServiceType,
} from '../sсrapers/ScraperServiceFactory';
import { PrismaService } from '../../prisma/prisma.service';

enum SourceType {
  telemart = 'TELEMART',
  rozetka = 'ROZETKA',
}

@WebSocketGateway({ cors: true })
export class ScraperGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ScraperGateway.name);
  private readonly redisClient: Redis;
  private readonly redlock: Redlock;

  constructor(
    private readonly scraperServiceFactory: ScraperServiceFactory,
    private readonly prisma: PrismaService,
  ) {
    const redis = new Redis({
      host: 'redis',
      port: 6379,
    });
    this.redisClient = redis;
    this.redlock = new Redlock([this.redisClient], {
      driftFactor: 0.01,
      retryCount: 5,
      retryDelay: 200,
      retryJitter: 100,
    });
  }

  @SubscribeMessage('startScraping')
  async handleScraping(@MessageBody() serviceType: string) {
    const lockKey = `scraper-lock:${serviceType}`;
    let lock;

    try {
      this.logger.log(`Attempting to acquire lock for ${serviceType}`);
      lock = await this.redlock.acquire([lockKey], 180000);
      this.logger.log(`Lock acquired for ${serviceType}`);

      const scraperService = this.scraperServiceFactory.createService(
        serviceType as ServiceType,
      );

      if (!scraperService.scrapeAndSave) {
        throw new Error(
          `Scraper for ${serviceType} does not implement scrapeAndSave`,
        );
      }

      await scraperService.scrapeAndSave();

      const sourceType = SourceType[serviceType as keyof typeof SourceType];
      const sourceString = sourceType.toString();

      const updatedProducts = await this.prisma.product.findMany({
        where: { source: sourceString },
      });

      this.logger.log(`Send metadata:`, updatedProducts);
      this.server.emit('updateProductsMetadata', updatedProducts);
    } catch (error) {
      if (error instanceof ExecutionError) {
        this.logger.warn(
          `Could not acquire lock for ${serviceType}: Retry window exceeded.`,
        );
      } else {
        this.logger.error(`Error during scraping ${serviceType}:`, error);
      }
    } finally {
      if (lock) {
        try {
          await lock.release();
          this.logger.log(`Lock released for ${serviceType}`);
        } catch (releaseError) {
          this.logger.error(
            `Failed to release lock for ${serviceType}:`,
            releaseError,
          );
        }
      }
    }
  }
}
