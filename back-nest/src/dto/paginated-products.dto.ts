import { Product } from '@prisma/client';

export class PaginatedProductsDto {
  page: number;
  limit: number;
  products: Product[];
}
