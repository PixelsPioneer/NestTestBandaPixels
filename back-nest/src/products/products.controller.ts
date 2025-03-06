import {
  Controller,
  Get,
  Delete,
  Logger,
  Param,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';

import { ProductService } from './products.services';
import { AuthGuard, RolesGuard } from '../authentication/auth.guard';

@Controller('product')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) {}

  @Get('')
  async searchProducts(
    @Query('searchTerm') title: string = '',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ): Promise<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    totalProducts: number;
  }> {
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    const { products, totalProducts } = title
      ? await this.productService.searchProductsByTitle(title, page, limit)
      : await this.getPaginatedProducts(page, limit);

    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;

    return {
      products,
      totalPages,
      currentPage: page,
      hasNextPage,
      totalProducts,
    };
  }

  private async getPaginatedProducts(page: number, limit: number) {
    const allProducts = await this.productService.getAllProducts();
    return this.productService.getPaginatedProducts(page, limit, allProducts);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<Product> {
    const product = await this.productService.getProductById(Number(id));
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }

  @UseGuards(AuthGuard, RolesGuard())
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    const productId = +id;
    await this.productService.deleteProduct(productId);
  }
}
