import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  async onModuleInit() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 1) || 6379,
    });

    this.redisClient.on('connect', () => console.log('Connected to Redis'));
    this.redisClient.on('error', (err) => console.error('Redis error:', err));
  }

  async set(
    key: string,
    value: any,
    expirationInSeconds?: number,
  ): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      if (expirationInSeconds) {
        await this.redisClient.set(
          key,
          serializedValue,
          'EX',
          expirationInSeconds,
        );
      } else {
        await this.redisClient.set(key, serializedValue);
      }
    } catch (err) {
      console.error('Error setting cache:', err);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redisClient.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      console.error('Error getting cache:', err);
      return null;
    }
  }

  async delete(): Promise<void> {
    try {
      await this.redisClient.flushall();
      console.log('All cache in Redis has been cleared');
    } catch (err) {
      console.error('Error clearing cache:', err);
    }
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
