import { Product } from '../models/product';
import { AppDataSource } from '../config/data-source';

export async function getAllElement() {
    try {
        const getElements = AppDataSource.getRepository(Product);
        return await getElements.find();
    } catch (error) {
        console.error(error);
    }
}