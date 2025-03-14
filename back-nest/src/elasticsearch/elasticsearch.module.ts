import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaService } from '../../prisma/prisma.service';
import { ElasticSearchService } from './elasticsearch.service';
import { ElasticSearchController } from './elasticsearch.controller';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const node = configService.getOrThrow<string>('ELASTICSEARCH_NODE');
        const username = configService.getOrThrow<string>(
          'ELASTICSEARCH_USERNAME',
        );
        const password = configService.getOrThrow<string>(
          'ELASTICSEARCH_PASSWORD',
        );

        if ((username && !password) || (!username && password)) {
          throw new Error('Invalid username or password');
        }

        const config: {
          node: string;
          auth?: { username: string; password: string };
        } = { node };

        if (username && password) {
          config.auth = { username, password };
        }

        return config;
      },
    }),
  ],
  controllers: [ElasticSearchController],
  providers: [ElasticSearchService, PrismaService],
  exports: [ElasticSearchService],
})
export class ElasticSearchModule {}
