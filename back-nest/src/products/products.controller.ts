import {
  Controller,
  Get,
  Delete,
  Logger,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '@prisma/client';

import { ProductService } from './products.services';
import { AuthGuard, RolesGuard } from '../authentication/auth.guard';
import { SearchProductsDto } from '../dto/search-products.dto';
import { PaginatedProductsDto } from '../dto/paginated-products.dto';
import { PaginatedResponseModel } from './model/paginatination-return.model';

@Controller('product')
export class ProductController {
  private readonly logger = new Logger(ProductController.name);
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchProducts(
    @Query() query: SearchProductsDto,
  ): Promise<PaginatedResponseModel> {
    const { searchTerm = '', page = 1, limit = 20 } = query;

    const allProducts = await this.productService.getAllProducts();

    const paginatedDto: PaginatedProductsDto = {
      page,
      limit,
      products: allProducts,
    };

    const { products, totalProducts } = searchTerm
      ? await this.productService.searchProductsByTitle(searchTerm, page, limit)
      : await this.productService.getPaginatedProducts(paginatedDto);

    const totalPages = Math.ceil(totalProducts / limit);
    const hasNextPage = page < totalPages;

    return new PaginatedResponseModel(
      products,
      totalPages,
      page,
      hasNextPage,
      totalProducts,
    );
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
