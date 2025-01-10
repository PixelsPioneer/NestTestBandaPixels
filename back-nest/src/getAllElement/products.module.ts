import { Module } from '@nestjs/common';
import { ProductService } from './products.services';
import { ProductController } from './products.contoller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [ProductService, PrismaService],
  controllers: [ProductController],
})
export class ProductModule {}
