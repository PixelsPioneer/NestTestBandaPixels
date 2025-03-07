import { ProductModel } from './product.model';

export class PaginatedResponseModel {
  products: ProductModel[];
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  totalProducts: number;

  constructor(
    products: ProductModel[],
    totalPages: number,
    currentPage: number,
    hasNextPage: boolean,
    totalProducts: number,
  ) {
    this.products = products;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.hasNextPage = hasNextPage;
    this.totalProducts = totalProducts;
  }
}
