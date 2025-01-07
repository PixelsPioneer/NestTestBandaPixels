import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/product.enity.model';
import { RedisService } from '../redis/redis.service';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly redisService: RedisService,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    const cachedProducts =
      await this.redisService.get<Product[]>('all_products');
    if (cachedProducts) {
      console.log('Returning products from cache');
      return cachedProducts;
    }

    await sleep(1);
    const products = await this.productRepository.find();

    if (!products) {
      throw new BadRequestException('No products found');
    }

    await this.redisService.set('all_products', products, 60);

    console.log('Returning products from database');
    return products;
  }
}
