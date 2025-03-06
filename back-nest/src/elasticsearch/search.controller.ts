import { Controller, Post, Body, Get, Query } from '@nestjs/common';

import { ProductSearchService } from './search.service';
import { Product } from './model/product.model';

@Controller('product-search')
export class ProductSearchController {
  constructor(private readonly productSearchService: ProductSearchService) {}

  @Post('index')
  async indexProduct(@Body() product: Product) {
    await this.productSearchService.indexProduct(product);
    return { message: 'Product indexed successfully' };
  }

  @Post('index-all')
  async indexAllProducts() {
    await this.productSearchService.indexAllProducts();
    return { message: 'All products indexed successfully' };
  }

  @Get('search')
  async searchProducts(@Query('query') query: string) {
    return this.productSearchService.searchProducts(query);
  }

  @Get('search-bar')
  async searchBarProduct(@Query('query') query: string) {
    return this.productSearchService.searchProducts(query);
  }
}
