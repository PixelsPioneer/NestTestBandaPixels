import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private redisClient: Redis;

  async onModuleInit() {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 1) || 6379,
    });

    this.redisClient.on('connect', () => Logger.log('Connected to Redis'));
    this.redisClient.on('error', (err) => Logger.error('Redis error:', err));
  }

  async set(
    key: string,
    value: any,
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
    } else {
      await this.redisClient.set(key, serializedValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? JSON.parse(value) : null;
  }

  async delete(): Promise<void> {
    await this.redisClient.flushall();
    Logger.log('All cache in Redis has been cleared');
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
  }
}
