import 'dotenv/config';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule } from '@nestjs/config';

import { ProductModule } from './products/products.module';
import { ScraperModule } from './sсrapers/scrapers.module';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './authentication/auth.module';
import { CartModule } from './cart/cart.module';
import { ElasticSearchModule } from './elasticsearch/elasticsearch.module';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
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
    PrismaModule,
    AuthModule,
    CartModule,
    ElasticSearchModule,
  ],
  providers: [S3Service],
})
export class AppModule {}
