import { ProductModel } from './product.model';

export class PaginatedResponseModel {
  constructor(
    public products: ProductModel[],
    public totalPages: number,
    public currentPage: number,
    public hasNextPage: boolean,
    public totalProducts: number,
  ) {}
  static create(data: Partial<PaginatedResponseModel>): PaginatedResponseModel {
    return new PaginatedResponseModel(
      data.products ?? [],
      data.totalPages ?? 1,
      data.currentPage ?? 1,
      data.hasNextPage ?? false,
      data.totalProducts ?? 0,
    );
  }
}
