import puppeteer from 'puppeteer';
import { AppDataSource } from '../config/data-source';
import { Product } from '../models/product';

export const scraperTelemart = async () => {
    try {
        const url = 'https://telemart.ua/ua/pc/';
        const browser = await puppeteer.launch({
            headless: true,
        });
        const page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
        );

        console.log('Navigating to Telemart...');
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });

        await page.waitForSelector('.product-item__inner', { timeout: 30000 });

        console.log('Extracting product data...');
        const products = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('.product-item__inner'));

            return items.map((element) => {
                const title = element.querySelector('.product-item__title a')?.textContent?.trim() || 'No title available';
                const subtitle = element.querySelector('.product-item__title a')?.getAttribute('href') || 'No subtitle available';
                const description = element.querySelector('.product-card__description')?.textContent?.trim() || 'No description available';
                const price = Number(element.getAttribute('data-price')) || 0;

                const specifications: { [key: string]: string } = {};
                element.querySelectorAll('.product-short-char__item').forEach((specElement) => {
                    const label = specElement.querySelector('.product-short-char__item__label')?.textContent?.trim() || 'Unknown';
                    const value = specElement.querySelector('.product-short-char__item__value')?.textContent?.trim() || 'Unknown';
                    specifications[label] = value;
                });

                const type = element.getAttribute('data-prod-type') || 'Unknown type';

                const imageElement = element.querySelector('.swiper-slide.swiper-slide-active img');
                const profileImage = imageElement ? imageElement.getAttribute('src') : null;

                const link = element.querySelector('.product-item__title a')?.getAttribute('href') || 'No link available';

                return {
                    title,
                    subtitle,
                    description,
                    price,
                    specifications: JSON.stringify(specifications),
                    type,
                    profileImage,
                    link,
                    source: 'TELESMART' as 'TELESMART',
                };
            });
        });

        console.log(`Found ${products.length} products.`);

        for (const productData of products) {
            const product = new Product(
                productData.title,
                productData.subtitle,
                productData.description,
                productData.price,
                productData.specifications,
                productData.type,
                productData.profileImage,
                productData.source
            );

            try {
                const productRepository = AppDataSource.getRepository(Product);
                const savedProduct = await productRepository.save(product);
                console.log(`Product added to DB with ID: ${savedProduct.id}`);
            } catch (error) {
                console.error('Error inserting product into DB:', error);
            }
        }

        await browser.close();
        return products;
    } catch (error) {
        console.error('Error during Telemart scraping:', error);
        throw error;
    }
};
