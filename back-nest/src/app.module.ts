import 'dotenv/config';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { ProductModule } from './products/products.module';
import { ScraperModule } from './sсrapers/scrapers.module';
import { RedisModule } from './redis/redis.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './authentication/auth.module';
import { CartModule } from './cart/cart.module';
import { SearchModule } from './elasticsearch/search.module';

@Module({
  imports: [
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
    SearchModule,
  ],
  providers: [],
})
export class AppModule {}
