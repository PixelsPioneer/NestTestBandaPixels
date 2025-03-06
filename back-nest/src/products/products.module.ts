import { Module } from '@nestjs/common';

import { ProductService } from './products.services';
import { ProductController } from './products.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchModule } from '../elasticsearch/search.module';

@Module({
  imports: [SearchModule],
  providers: [ProductService, PrismaService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
