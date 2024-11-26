import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../models/product.enity.model';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async getAllProducts(): Promise<Product[]> {
        try {
            return await this.productRepository.find();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }
}
