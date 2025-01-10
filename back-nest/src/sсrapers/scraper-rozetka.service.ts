import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { product as ProductType } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScraperRozetkaService {
  private readonly logger = new Logger(ScraperRozetkaService.name);

  constructor(private readonly prisma: PrismaService) {}

  async scraperRozetka(): Promise<Omit<ProductType, 'id'>[]> {
    const url = 'https://rozetka.com.ua/ua/computers-notebooks/c80095/';
    this.logger.log(`Starting scraping Rozetka URL: ${url}`);

    const response = await axios.get(url);
    if (response.status !== 200) {
      this.logger.error(`Failed to fetch data from ${url}`);
      return [];
    }

    const $ = cheerio.load(response.data);
    const products: Omit<ProductType, 'id'>[] = [];

    $('.goods-tile').each((index, element) => {
      const title = $(element).find('.goods-tile__title').text().trim();
      const subtitle = $(element).find('.product-link a').attr('href') || null;
      const description =
        $(element).find('.goods-tile__description').text().trim() ||
        'No description available';
      const newPrice = parseFloat(
        $(element)
          .find('.goods-tile__price-value')
          .text()
          .replace(/\s/g, '')
          .trim(),
      );
      const specifications =
        $(element).find('.goods-tile__specifications').text().trim() ||
        'No specifications available';
      const type = 'Computer';
      const profileImage =
        $(element).find('.goods-tile__picture img').attr('src') ||
        $(element).find('.goods-tile__picture img').attr('data-src');
      const source = 'ROZETKA';

      if (title && newPrice && profileImage) {
        const productData: Omit<ProductType, 'id'> = {
          title,
          subtitle,
          description,
          newPrice,
          specifications,
          type,
          profileImage,
          source,
        };

        products.push(productData);
      }
    });

    this.logger.log(`Scraped ${products.length} products from Rozetka.`);
    return products;
  }

  async saveProductsToDB(products: Omit<ProductType, 'id'>[]): Promise<void> {
    if (!products?.length) {
      this.logger.log('No products to save.');
      return;
    }

    const operations = products.map(async (product) => {
      this.prisma.product.upsert({
        where: {
          title_source: {
            title: product.title,
            source: product.source,
          },
        },
        create: product,
        update: product,
      });
    });

    await Promise.all(operations);

    this.logger.log(`Successfully processed ${products.length} products.`);
  }
}
