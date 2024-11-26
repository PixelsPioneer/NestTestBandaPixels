import { AppDataSource } from '../config/data-source';
import { Product } from '../models/product';

export const saveProductsToDB = async (products: any[], source: 'ROZETKA' | 'TELESMART') => {
    try {
        const productRepository = AppDataSource.getRepository(Product);

        const existingProducts = await productRepository.find({ where: { source } });

        if (existingProducts.length > 0) {
            await productRepository.remove(existingProducts);
        }

        const entities = products.map((product) => ({
            ...product,
            source,
        }));

        await productRepository.save(entities);

        console.log(`Successfully saved ${products.length} products from ${source} to the database.`);
    } catch (error) {
        console.error('Error saving products to database:', error);
        throw error;
    }
};

