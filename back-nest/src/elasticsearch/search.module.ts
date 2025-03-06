import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

import { PrismaService } from '../../prisma/prisma.service';
import { ProductSearchService } from './search.service';
import { ProductSearchController } from './search.controller';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => {
        const node = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
        const username = process.env.ELASTICSEARCH_USERNAME || 'elastic';
        const password = process.env.ELASTICSEARCH_PASSWORD || 'rootpassword';

        const authConfig = { username, password };

        return {
          node,
          auth: authConfig,
        };
      },
    }),
  ],
  controllers: [ProductSearchController],
  providers: [ProductSearchService, PrismaService],
  exports: [ProductSearchService],
})
export class SearchModule {}
