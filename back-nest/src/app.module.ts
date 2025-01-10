import 'dotenv/config';
import { Module } from '@nestjs/common';
import { ProductModule } from './getAllElement/products.module';
import { ScraperModule } from './sсrapers/scrapers.module';
import { RedisModule } from './redis/redis.module';
import { LoggerModule } from 'nestjs-pino';
import { PrismaService } from '../prisma/prisma.service';

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
  ],
  providers: [PrismaService], // Додано PrismaService до провайдерів
})
export class AppModule {}
