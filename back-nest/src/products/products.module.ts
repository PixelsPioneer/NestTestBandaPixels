import { Module } from '@nestjs/common';

import { ProductService } from './products.services';
import { ProductController } from './products.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { ElasticSearchModule } from '../elasticsearch/elasticsearch.module';

@Module({
  imports: [ElasticSearchModule],
  providers: [ProductService, PrismaService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
