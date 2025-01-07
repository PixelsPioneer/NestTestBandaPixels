import { Controller, Get } from '@nestjs/common';
import { ProductService } from './products.services';
import { Product } from '../models/product.enity.model';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return await this.productService.getAllProducts();
  }
}
