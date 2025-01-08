import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './getAllElement/products.module';
import { Product } from './models/product.enity.model';
import { ScraperModule } from './sсrapers/scrapers.module';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 1) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Product],
      synchronize: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        formatters: {
          log(object) {
            return {
              ...object,
              context: object.context || 'Application',
            };
          },
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                  ignore: 'pid,hostname',
                  singleLine: true,
                },
              }
            : undefined,
      },
    }),
    ProductModule,
    ScraperModule,
    RedisModule,
  ],
})
export class AppModule {}
