import {
  Controller,
  Get,
  Delete,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { product } from '@prisma/client';

import { ProductService } from './products.services';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<product[]> {
    return this.productService.getAllProducts();
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const productId = +id;

    const product = await this.productService.deleteProduct(productId);

    if (!product) {
      throw new NotFoundException(`Product with id ${productId} not found`);
    }

    return { message: `Product with id ${productId} has been deleted` };
  }
}
