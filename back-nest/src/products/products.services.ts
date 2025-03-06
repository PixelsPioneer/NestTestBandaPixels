import { Injectable, Logger } from '@nestjs/common';
import { Product } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { CacheKeys } from '../redis/cache-keys.constant';
import { ScrapedProduct } from '../sсrapers/models/scraped-product.model';
import { ProductSearchService } from '../elasticsearch/search.service';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
    private readonly productSearchService: ProductSearchService,
  ) {}

  async searchProductsByTitle(title: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const take = limit;

    const products = await this.prisma.product.findMany({
      where: {
        title: {
          contains: title,
          // mode: 'insensitive',
        },
      },
      skip,
      take,
    });

    const totalProducts = await this.prisma.product.count({
      where: {
        title: {
          contains: title,
          // mode: 'insensitive',
        },
      },
    });

    return {
      products,
      totalProducts,
    };
  }

  async getPaginatedProducts(
    page: number,
    limit: number,
    products: Product[],
  ): Promise<{
    products: Product[];
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    totalProducts: number;
  }> {
    const skip = (page - 1) * limit;
    const take = limit;

    const totalPages = Math.ceil(products.length / limit);
    const hasNextPage = page < totalPages;

    const paginatedProducts = products.slice(skip, skip + take);

    return {
      products: paginatedProducts,
      totalPages,
      currentPage: page,
      hasNextPage,
      totalProducts: products.length,
    };
  }

  async getAllProducts(): Promise<Product[]> {
    const cachedProducts = await this.redisService.get<Product[]>(
      CacheKeys.PRODUCTS,
    );
    if (cachedProducts) {
      this.logger.log('Returning products from cache');
      return cachedProducts;
    }

    const products = await this.prisma.product.findMany();

    if (!products?.length) {
      return [];
    }

    await this.redisService.set(CacheKeys.PRODUCTS, products, 60);

    this.logger.log('Returning products from database');
    return products;
  }

  async getProductById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async upsertProducts(products: ScrapedProduct[]): Promise<void> {
    await this.prisma.$transaction(
      products.map((productData) => {
        const { title, source, price, newPrice, profileImages, ...rest } =
          productData;

        const profileImagesArray: string[] = Array.isArray(profileImages)
          ? profileImages
          : profileImages
            ? [profileImages]
            : [];

        const productToUpdate = {
          ...rest,
          title,
          price,
          newPrice,
          source,
          profileImages: profileImagesArray,
        };

        this.logger.log(`Upserting product: ${title} from source: ${source}`);

        return this.prisma.product.upsert({
          where: {
            title_source: { title, source },
          },
          update: { ...productToUpdate },
          create: { ...productToUpdate },
        });
      }),
    );

    const savedProducts = await this.prisma.product.findMany({
      where: {
        title: { in: products.map((p) => p.title) },
      },
    });

    if (!savedProducts.length) {
      this.logger.warn('No products were found in DB after upsert.');
      return;
    }

    for (const product of savedProducts) {
      await this.productSearchService.indexProduct(product);
    }

    this.logger.log(
      `Successfully indexed ${savedProducts.length} products in search.`,
    );
  }

  async deleteProduct(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
    this.logger.log('Product has been deleted');

    await this.redisService.deleteProductCache();
  }
}
