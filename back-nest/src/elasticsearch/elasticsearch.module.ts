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
        const node = configService.get<string>('ELASTICSEARCH_NODE', '');
        const username = configService.get<string>(
          'ELASTICSEARCH_USERNAME',
          '',
        );
        const password = configService.get<string>(
          'ELASTICSEARCH_PASSWORD',
          '',
        );

        return {
          node,
          auth: username && password ? { username, password } : undefined,
        };
      },
    }),
  ],
  controllers: [ElasticSearchController],
  providers: [ElasticSearchService, PrismaService],
  exports: [ElasticSearchService],
})
export class ElasticSearchModule {}
