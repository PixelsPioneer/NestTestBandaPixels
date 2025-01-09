import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './products.services';
import { ProductController } from './products.contoller';
import { Product } from '../models/product.enity.model';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
