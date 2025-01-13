import { Controller, Get, Logger } from '@nestjs/common';
import { product as ProductType } from '@prisma/client';

import { ScraperTelemartService } from './scraper-telemart.service';
import { ScraperRozetkaService } from './scraper-rozetka.service';
import { PrismaService } from '../../prisma/prisma.service';
import { ScrapeRozetkaResponseDto } from '../dto/scrapeRozetkaResponse.dto';

@Controller('scraper')
export class ScraperController {
  private readonly logger = new Logger(ScraperController.name);

  constructor(
    private readonly telemartScraperService: ScraperTelemartService,
    private readonly rozetkaScraperService: ScraperRozetkaService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('scrape-telemart')
  async scrapeTelemart(): Promise<ProductType[]> {
    this.logger.log('Starting Telemart scraping...');
    const scrapedProducts = await this.telemartScraperService.scrapeTelemart();

    if (!scrapedProducts || scrapedProducts.length === 0) {
      this.logger.warn('No products were scraped from Telemart.');
      return [];
    }

    this.logger.log(
      `Scraped ${scrapedProducts.length} products from Telemart.`,
    );

    const savedProducts = await Promise.all(
      scrapedProducts.map(async (product) => {
        const existingProduct = await this.prisma.product.findUnique({
          where: {
            title_source: {
              title: product.title,
              source: product.source,
            },
          },
        });

        if (existingProduct) {
          this.logger.log(`Updating product: ${product.title}`);
          return await this.prisma.product.update({
            where: {
              title_source: {
                title: product.title,
                source: product.source,
              },
            },
            data: product,
          });
        }

        this.logger.log(`Creating new product: ${product.title}`);
        return await this.prisma.product.create({
          data: product,
        });
      }),
    );

    this.logger.log(
      `Successfully processed ${savedProducts.length} products from Telemart.`,
    );
    return savedProducts;
  }

  @Get('scrape-rozetka')
  async scrapeRozetka(): Promise<ScrapeRozetkaResponseDto> {
    this.logger.log('Starting to scrape products from Rozetka...');

    const scrapedProducts = await this.rozetkaScraperService.scraperRozetka();

    if (!scrapedProducts || scrapedProducts.length === 0) {
      this.logger.warn('No products were scraped from Rozetka.');
      return {
        message: 'No products were scraped from Rozetka.',
        totalProducts: 0,
      };
    }

    this.logger.log(`Scraped ${scrapedProducts.length} products from Rozetka.`);

    const savedProducts = await Promise.all(
      scrapedProducts.map(async (product) => {
        const existingProduct = await this.prisma.product.findUnique({
          where: {
            title_source: {
              title: product.title,
              source: product.source,
            },
          },
        });

        if (existingProduct) {
          this.logger.log(`Updating product: ${product.title}`);
          return await this.prisma.product.update({
            where: {
              title_source: {
                title: product.title,
                source: product.source,
              },
            },
            data: product,
          });
        }

        this.logger.log(`Creating new product: ${product.title}`);
        return await this.prisma.product.create({
          data: product,
        });
      }),
    );

    this.logger.log(
      `Scraping, update, and insert completed successfully. Total products processed: ${savedProducts.length}`,
    );

    return {
      message: 'Scraping, update, and insert completed successfully.',
      totalProducts: savedProducts.length,
    };
  }
}
