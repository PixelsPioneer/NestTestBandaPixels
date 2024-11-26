import axios from 'axios';
import * as cheerio from 'cheerio';
import { AppDataSource } from '../config/data-source';
import { Product } from '../models/product';

export const scraperRozetka = async () => {
    try {
        const url = 'https://rozetka.com.ua/ua/computers-notebooks/c80095/';
        const response = await axios.get(url);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch data from ${url}`);
        }

        const $ = cheerio.load(response.data);
        const products: any[] = [];

        for (const element of $('.goods-tile').toArray()) {
            const title = $(element).find('.goods-tile__title').text().trim();
            const subtitle = $(element).find('.product-link').attr('href') || null;
            const description = $(element).find('.goods-tile__description').text().trim() || 'No description available'; 
            const newPrice = parseFloat(
                $(element)
                    .find('.goods-tile__price-value')
                    .text()
                    .replace(/\s/g, '') 
                    .trim()
            );
            const specifications = $(element).find('.goods-tile__specifications').text().trim() || 'No specifications available'; 
            const type = 'Computer'; 
            const profileImage = $(element)
                .find('.goods-tile__picture img')
                .attr('src') || $(element).find('.goods-tile__picture img').attr('data-src');
            const source: "ROZETKA" = 'ROZETKA'; 

            if (title && newPrice && profileImage) {
                const product = new Product(
                    title,
                    subtitle,
                    description,
                    newPrice,
                    specifications,
                    type,
                    profileImage,
                    source
                );

                try {
                    const productRepository = AppDataSource.getRepository(Product);
                    const result = await productRepository.save(product);
                    console.log('Product added to DB with ID:', result.id);
                } catch (error) {
                    console.error('Error inserting product into DB:', error);
                }

                products.push(product);
            }
        }

        return products;
    } catch (error) {
        console.error(`Error during scraping: ${error}`);
        throw error;
    }
};
