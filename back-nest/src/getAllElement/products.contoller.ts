import { Controller, Get } from '@nestjs/common';
import { product } from '@prisma/client';

import { ProductService } from './products.services';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<product[]> {
    return this.productService.getAllProducts();
  }
}
