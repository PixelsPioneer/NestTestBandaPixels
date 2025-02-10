import { Injectable, Logger } from '@nestjs/common';
import { Product } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CacheKeys } from '../redis/cache-keys.constant';
import { ScrapedProduct } from '../sсrapers/models/scraped-product.model';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const cachedProducts = await this.redisService.get<Product[]>(
      CacheKeys.PRODUCTS,
    );
    if (cachedProducts) {
      this.logger.log('Returning products from cache');
      return cachedProducts;
    }

    const products = await this.prisma.product.findMany();

    if (!products?.length) {
      return [];
    }

    await this.redisService.set(CacheKeys.PRODUCTS, products, 60);

    this.logger.log('Returning products from database');
    return products;
  }

  async getProductById(id: number): Promise<Product> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async upsertProducts(products: ScrapedProduct[]): Promise<void> {
    await Promise.all(
      products.map((productData) => {
        const { title, source, price, newPrice, ...rest } = productData;

        const productToUpdate = {
          ...rest,
          title,
          price,
          newPrice,
          source,
        };

        this.logger.log(`Upserting product: ${title} from source: ${source}`);

        return this.prisma.product.upsert({
          where: {
            title_source: {
              title,
              source,
            },
          },
          update: { ...productToUpdate },
          create: { ...productToUpdate },
        });
      }),
    );
  }

  async deleteProduct(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
    this.logger.log('Product has been deleted');

    await this.redisService.deleteProductCache();
  }
}
