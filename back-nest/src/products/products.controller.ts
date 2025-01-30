import { Controller, Get, Delete, Param, UseGuards } from '@nestjs/common';
import { product } from '@prisma/client';

import { ProductService } from './products.services';
import { AuthGuard, RolesGuard } from '../authentication/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<product[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<product> {
    return this.productService.getProductById(Number(id));
  }

  @UseGuards(AuthGuard, RolesGuard())
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const productId = +id;
    await this.productService.deleteProduct(productId);
  }
}
