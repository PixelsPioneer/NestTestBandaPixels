import { Injectable, Logger } from '@nestjs/common';
import { product } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CacheKeys } from '../redis/cache-keys.constant';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getAllProducts(): Promise<product[]> {
    const cachedProducts = await this.redisService.get<product[]>(
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
}
