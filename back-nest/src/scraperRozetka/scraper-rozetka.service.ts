import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../models/product.enity.model';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async scraperRozetka(): Promise<Product[]> {
    const url = 'https://rozetka.com.ua/ua/computers-notebooks/c80095/';
    this.logger.log(`Starting scraping Rozetka URL: ${url}`);

    try {
      const response = await axios.get(url);

      if (response.status !== 200) {
        this.logger.error(`Failed to fetch data from ${url}`);
        throw new Error(`Failed to fetch data from ${url}`);
      }

      const $ = cheerio.load(response.data);
      const products: Product[] = [];

      $('.goods-tile').each((index, element) => {
        const title = $(element).find('.goods-tile__title').text().trim();
        const subtitle = $(element).find('.product-link').attr('href') || null;
        const description =
          $(element).find('.goods-tile__description').text().trim() || 'No description available';
        const newPrice = parseFloat(
          $(element).find('.goods-tile__price-value').text().replace(/\s/g, '').trim(),
        );
        const specifications =
          $(element).find('.goods-tile__specifications').text().trim() || 'No specifications available';
        const type = 'Computer';
        const profileImage =
          $(element).find('.goods-tile__picture img').attr('src') ||
          $(element).find('.goods-tile__picture img').attr('data-src');
        const source: 'ROZETKA' = 'ROZETKA';

        if (title && newPrice && profileImage) {
          const product = this.productRepository.create({
            title,
            subtitle,
            description,
            newPrice,
            specifications,
            type,
            profileImage,
            source,
          });
          products.push(product);
        }
      });

      this.logger.log(`Scraped ${products.length} products from Rozetka.`);
      return products;
    } catch (error) {
      this.logger.error('Error during Rozetka scraping:', error);
      throw error;
    }
  }

    async clearProducts(): Promise<void> {
      try {
        this.logger.log('Clearing existing products from the database...');
        await this.productRepository.clear();
        this.logger.log('Successfully cleared all products from the database.');
      } catch (error) {
        this.logger.error('Failed to clear products from the database:', error);
        throw error;
      }
    }

  async saveProductsToDB(products: Product[], source: string): Promise<void> {
    try {
      if (products.length > 0) {
        await this.productRepository.save(products);
        this.logger.log(`Saved ${products.length} products from ${source} to DB.`);
      }
    } catch (error) {
      this.logger.error(`Error saving products from ${source} to DB:`, error);
      throw error;
    }
  }
}