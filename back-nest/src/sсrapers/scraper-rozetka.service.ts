import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

import { Sources } from './models/sources';
import { ScrapedProduct } from './models/scraped-product.model';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ScraperRozetkaService {
  private readonly logger = new Logger(ScraperRozetkaService.name);

  constructor(private readonly redisService: RedisService) {}

  async scrapeRozetkaProducts(): Promise<ScrapedProduct[]> {
    const url = 'https://rozetka.com.ua/ua/computers-notebooks/c80095/';
    this.logger.log(`Starting scraping Rozetka URL: ${url}`);
    const products: ScrapedProduct[] = [];

    const response = await axios.get(url);
    if (response.status !== 200) {
      this.logger.error(`Failed to fetch data from ${url}`);
      return [];
    }

    const $ = cheerio.load(response.data);

    $('.goods-tile').each((index, element) => {
      const title = $(element).find('.goods-tile__title').text().trim();
      const subtitle = $(element).find('.product-link a').attr('href') || null;
      const description =
        $(element).find('.goods-tile__description').text().trim() ||
        'No description available';
      const price = parseFloat(
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

      if (title && price && profileImage) {
        const productData: ScrapedProduct = {
          title,
          subtitle,
          description,
          price,
          specifications,
          type,
          profileImage,
          newPrice: null,
          source: Sources.Rozetka,
        };

        products.push(productData);
      }
    });

    await this.redisService.delete();
    this.logger.log('Redis cache cleared after saving products to DB.');

    this.logger.log(`Scraped ${products.length} products from Rozetka.`);

    return products;
  }
}
