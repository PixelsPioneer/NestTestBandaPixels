import { Injectable, Logger } from '@nestjs/common';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import { randomUUID } from 'crypto';

import { Sources } from './models/sources';
import { ScrapedProduct } from './models/scraped-product.model';
import { ProductService } from '../products/products.services';
import { ScraperService } from './models/scraper-service.model';
import { S3Service } from '../s3/s3.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class ScraperRozetkaService implements ScraperService {
  private readonly logger = new Logger(ScraperRozetkaService.name);

  constructor(
    private readonly redisService: RedisService,
    private readonly productService: ProductService,
    private readonly s3Service: S3Service,
  ) {}

  async scrapeRozetkaProducts(): Promise<ScrapedProduct[]> {
    const url = 'https://rozetka.com.ua/ua/computers-notebooks/c80095/';
    this.logger.log(`Starting scraping Rozetka URL: ${url}`);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-web-security', '--no-sandbox'],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    );

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    this.logger.log(`Navigating to ${url}...`);
    await page.goto(url, { waitUntil: 'load', timeout: 60000 });

    await page.evaluate(async () => {
      let scrollHeight = document.body.scrollHeight;
      let scrolledHeight = 0;
      const distance = 100;

      while (scrolledHeight < scrollHeight) {
        window.scrollBy(0, distance);
        scrolledHeight += distance;

        await new Promise((resolve) => setTimeout(resolve, 900));

        const newScrollHeight = document.body.scrollHeight;

        if (newScrollHeight > scrollHeight) {
          scrollHeight = newScrollHeight;
        }
      }
    });

    await page.waitForSelector('.goods-tile', { timeout: 30000 });
    await page.waitForSelector('.goods-tile__hidden-holder', {
      timeout: 30000,
    });
    await page.waitForSelector('.goods-tile__picture', { timeout: 30000 });
    await page.waitForSelector('img[loading="lazy"], img[src]', {
      timeout: 60000,
    });

    await page.evaluate(() => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach((img) => {
        if (img instanceof HTMLImageElement) {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
        }
      });
    });

    const htmlContent = await page.content();
    const $ = cheerio.load(htmlContent);

    const products: ScrapedProduct[] = [];

    $('.goods-tile').each((index, element) => {
      const title = $(element).find('.goods-tile__title').text().trim();
      const subtitle = $(element).find('.product-link a').attr('href') || null;
      const description =
        $(element).find('.goods-tile__description').text().trim() ||
        'No description available';

      const oldPrice: string | null =
        $(element)
          .find('.goods-tile__price--old')
          .text()
          .replace(/\s/g, '')
          .trim() || null;

      const currentPrice = $(element)
        .find('.goods-tile__price-value')
        .text()
        .replace(/\s/g, '')
        .trim();

      const price = oldPrice ? parseFloat(oldPrice) : parseFloat(currentPrice);

      const hasDiscount = !!oldPrice;

      const specifications: Record<string, string> = {};

      $(element)
        .find('.goods-tile__params-list li')
        .each((_, specElement) => {
          const label = $(specElement)
            .find('.goods-tile__params-label')
            .text()
            .trim();
          const value =
            $(specElement).find('a').text().trim() ||
            $(specElement).text().trim();

          if (label && value) {
            specifications[label] = value;
          }
        });
      const type = 'Computer';

      const profileImages: string[] = [];

      $(element)
        .find('.goods-tile__picture img')
        .each((_, imgElement) => {
          const imageUrl =
            $(imgElement).attr('src') || $(imgElement).attr('data-src');
          if (imageUrl && !profileImages.includes(imageUrl)) {
            profileImages.push(imageUrl);
          }
        });

      const ratingStyle = $(element).find('.stars__rating').attr('style');

      let rating: number | null = null;
      if (ratingStyle) {
        const match = ratingStyle.match(/width:\s*calc\((\d+)%/);
        if (match) {
          const percentage = parseInt(match[1], 10);
          rating = parseFloat((percentage / 20).toFixed(1));
        }
      }

      if (title && profileImages && price) {
        const productData: ScrapedProduct = {
          title,
          subtitle,
          description,
          price,
          newPrice: hasDiscount ? parseFloat(currentPrice) : null,
          specifications: JSON.stringify(specifications),
          type,
          profileImages,
          hasDiscount,
          rating,
          source: Sources.Rozetka,
        };

        products.push(productData);
      }
    });

    await this.redisService.delete();
    this.logger.log('Redis cache cleared after saving products to DB.');

    this.logger.log(`Scraped ${products.length} products from Rozetka.`);

    await browser.close();

    return products;
  }

  async scrapeAndSave(): Promise<void> {
    this.logger.log('Starting to scrape products from Rozetka...');

    const scrapedProducts = await this.scrapeRozetkaProducts();

    if (!scrapedProducts || scrapedProducts.length === 0) {
      this.logger.warn('No products were scraped from Rozetka.');
      return;
    }

    this.logger.log(`Scraped ${scrapedProducts.length} products from Rozetka.`);

    const productsToUpsert: ScrapedProduct[] = [];

    for (const product of scrapedProducts) {
      if (product.profileImages && product.profileImages.length > 0) {
        const productSerialNumber = product.title.match(/\(([^)]+)\)/);

        const productFolder =
          productSerialNumber?.[1] ||
          product.title.replace(/[^a-zA-Z0-9_-]/g, '_') ||
          randomUUID();

        const uploadedImageUrls = await Promise.all(
          product.profileImages.map(async (imageUrl, index) => {
            return await this.s3Service.uploadImage(
              imageUrl,
              `${productFolder}/${index}`,
            );
          }),
        );

        const images = uploadedImageUrls.filter(
          (url): url is string => url !== null,
        );

        await this.redisService.saveProductImages(productFolder, images);

        productsToUpsert.push({
          ...product,
          profileImages: images,
        });

        this.logger.log(
          `Uploaded ${product.profileImages.length} images for product ${product.title}`,
        );
      }
    }

    await this.productService.upsertProducts(scrapedProducts);

    this.logger.log(
      `Successfully processed ${scrapedProducts.length} products from ${Sources.Rozetka}`,
    );
  }
}
