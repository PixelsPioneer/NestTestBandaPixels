import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';

import { Cart } from '../cart/model/cart.model';
import { CacheKeys } from './cache-keys.constant';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redisClient: Redis;

  async onModuleInit() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
    });

    this.redisClient.on('connect', () => this.logger.log('Connected to Redis'));
    this.redisClient.on('error', (err) =>
      this.logger.error('Redis error:', err),
    );
  }

  async set<T>(
    key: string,
    value: T,
    expirationInSeconds?: number,
  ): Promise<void> {
    const serializedValue = JSON.stringify(value);
    if (expirationInSeconds) {
      await this.redisClient.set(
        key,
        serializedValue,
        'EX',
        expirationInSeconds,
      );
      return;
    }
    await this.redisClient.set(key, serializedValue);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async delete(): Promise<void> {
    await this.redisClient.flushdb();
    this.logger.log('Cache in current Redis has been cleared');
  }

  async deleteProductCache(): Promise<void> {
    await this.redisClient.del(CacheKeys.PRODUCTS);
    this.logger.log(`Cache for the key ${CacheKeys.PRODUCTS} has been cleared`);
  }

  async setCart(userId: number, cart: Cart): Promise<void> {
    const key = `${CacheKeys.CARTS}:${userId}`;
    await this.set<Cart>(key, cart, 120);
    this.logger.log(`Cart for user ${userId} has been cached`);
  }

  async getCart(userId: number): Promise<Cart> {
    const key = `${CacheKeys.CARTS}:${userId}`;
    const cart = await this.get<Cart>(key);
    return cart ?? { items: [] };
  }

  async clearCart(userId: number): Promise<void> {
    const key = `${CacheKeys.CARTS}:${userId}`;
    await this.redisClient.del(key);
    this.logger.log(`Cart for user ${userId} has been cleared`);
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async saveProductImages(productFolder: string, images: string[]) {
    if (images.length > 0) {
      await this.redisClient.set(
        `product-image:${productFolder}`,
        JSON.stringify(images),
      );
    }
  }

  async getProductImages(productFolder: string): Promise<string[]> {
    const images = await this.redisClient.get(`product-image:${productFolder}`);
    return images ? JSON.parse(images) : [];
  }
}
