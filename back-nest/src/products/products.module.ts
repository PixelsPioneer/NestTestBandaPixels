import { Global, Module } from '@nestjs/common';

import { ProductService } from './products.services';
import { ProductController } from './products.contoller';
import { PrismaService } from '../../prisma/prisma.service';

@Global()
@Module({
  providers: [ProductService, PrismaService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
