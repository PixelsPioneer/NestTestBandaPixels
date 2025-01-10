import { Controller, Get } from '@nestjs/common';
import { ProductService } from './products.services';
import { product } from '@prisma/client';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<product[]> {
    return this.productService.getAllProducts();
  }
}
