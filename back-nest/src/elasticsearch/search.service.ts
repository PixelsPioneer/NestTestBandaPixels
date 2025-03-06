import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { PrismaService } from '../../prisma/prisma.service';
import { Product } from './model/product.model';

@Injectable()
export class ProductSearchService {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly prisma: PrismaService,
  ) {}

  async indexProduct(product: Product) {
    const profileImages = Array.isArray(product.profileImages)
      ? product.profileImages
      : product.profileImages && typeof product.profileImages === 'string'
        ? [product.profileImages]
        : [];

    await this.elasticsearchService.index({
      index: 'products',
      document: {
        id: product.id,
        title: product.title,
        subtitle: product.subtitle,
        description: product.description,
        price: product.price,
        newPrice: product.newPrice ?? null,
        specifications: product.specifications,
        type: product.type,
        profileImages,
        source: product.source,
        hasDiscount: product.hasDiscount,
        rating: product.rating,
      },
    });
  }

  async getProductById(id: number): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (product && product.profileImages) {
      product.profileImages = Array.isArray(product.profileImages)
        ? product.profileImages
        : [String(product.profileImages)];
    }

    return product;
  }

  async indexAllProducts() {
    const products = await this.prisma.product.findMany();
    const indexPromises = products.map(async (product) => {
      try {
        await this.indexProduct(product);
      } catch (error) {
        console.error(`Failed to index product ${product.id}:`, error);
      }
    });
    await Promise.all(indexPromises);
  }

  async searchProducts(query: string) {
    const result = await this.elasticsearchService.search({
      index: 'products',
      query: {
        match: {
          title: {
            query,
            fuzziness: 2,
          },
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  }

  async searchBarProduct(query: string) {
    const result = await this.elasticsearchService.search({
      index: 'products',
      body: {
        query: {
          multi_match: {
            query,
            fields: ['title'],
          },
        },
      },
    });

    return result.hits.hits.map((hit) => hit._source);
  }
}
