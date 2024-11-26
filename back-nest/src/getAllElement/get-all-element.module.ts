import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './get-all-element.services';
import { ProductController } from './get-all-element.contoller';
import { Product } from '../models/product.enity.model';

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    providers: [ProductService],
    controllers: [ProductController],
})
export class ProductModule {}
