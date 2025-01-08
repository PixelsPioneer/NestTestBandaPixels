import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/product.enity.model';
import { RedisService } from '../redis/redis.service';
import { CacheKeys } from '../redis/cache-keys.constant';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly redisService: RedisService,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const cachedProducts = await this.redisService.get<Product[]>(
      CacheKeys.PRODUCTS,
    );
    if (cachedProducts) {
      Logger.log('Returning products from cache');
      return cachedProducts;
    }

    const products = await this.productRepository.find();

    if (!products) {
      throw new BadRequestException('No products found');
    }

    await this.redisService.set(CacheKeys.PRODUCTS, products, 60);

    Logger.log('Returning products from database');
    return products;
  }
}
