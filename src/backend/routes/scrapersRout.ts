import express from 'express';
import { scraperRozetka } from '../services/scraperRozetkaSevice';
import { scraperTelemart } from '../services/scraperTelemartServices';
import { saveProductsToDB } from '../services/saveDataService';
import { getAllElement } from '../services/getAllElementService';
const router = express.Router();

/**
 * @swagger
 * /api/scrape:
 *   post:
 *     summary: Launches scraping for Rozetka and Telemart, saves data in the database.
 *     tags:
 *       - Scraping
 *     responses:
 *       200:
 *         description: Scraping was successful, data saved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scraping and saving completed successfully!
 *                 rozetka:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Комп'ютер ARTLINE Gaming X43"
 *                       subtitle:
 *                         type: string
 *                         example: "https://hard.rozetka.com.ua/ua/artline-x43v45/p422114907/"
 *                       description:
 *                         type: string
 *                         example: "No description available"
 *                       price:
 *                         type: number
 *                         example: 23999
 *                       specifications:
 *                         type: string
 *                         example: "No specifications available"
 *                       type:
 *                         type: string
 *                         example: "Computer"
 *                       profileImage:
 *                         type: string
 *                         example: "https://content.rozetka.com.ua/goods/images/big_tile/416512630.jpg"
 *                       source:
 *                         type: string
 *                         example: "ROZETKA"
 *                       id:
 *                         type: integer
 *                         example: 1681
 *                 telemart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Комп'ютер HEXO Gaming RTX4060 Base"
 *                       subtitle:
 *                         type: string
 *                         example: "https://telemart.ua/ua/products/hexo-gaming-rtx4060-base-hgb-3600n4060-16s480bkdk-blackdark/"
 *                       description:
 *                         type: string
 *                         example: "No description available"
 *                       price:
 *                         type: number
 *                         example: 29999
 *                       specifications:
 *                         type: string
 *                         example: "{\"Процесор:\":\"AMD Ryzen 5 3600 (3.6–4.2 ГГц), 6 ядер\",\"Материнська плата:\":\"A520\",\"Відеокарта:\":\"RTX 4060, 8 ГБ\",\"Внутрішній накопичувач:\":\"Накопичувач SATA\",\"Оперативна пам'ять:\":\"16 ГБ, 3200 МГц (DDR4)\",\"Блок живлення:\":\"650 Вт\",\"Сертифікат блока живлення:\":\"Bronze\"}"
 *                       type:
 *                         type: string
 *                         example: "Компьютери"
 *                       profileImage:
 *                         type: string
 *                         example: "https://img.telemart.ua/561400-836185-category_page/hexo-gaming-rtx4060-base-hgb-3600n4060-16s480bkdk-blackdark.png"
 *                       link:
 *                         type: string
 *                         example: "https://telemart.ua/ua/products/hexo-gaming-rtx4060-base-hgb-3600n4060-16s480bkdk-blackdark/"
 *                       source:
 *                         type: string
 *                         example: "TELESMART"
 *       500:
 *         description: An error occurred while scraping or saving data.
 */

router.post('/scrape', async (req, res) => {
    try {
        console.log('Starting scraping for Rozetka and Telemart...');

        const [rozetkaProducts, telemartProducts] = await Promise.all([
            scraperRozetka(),
            scraperTelemart(),
        ]);

        console.log('Rozetka Products Count:', rozetkaProducts.length);
        console.log('Telemart Products Count:', telemartProducts.length);

        await Promise.all([
            saveProductsToDB(rozetkaProducts, 'ROZETKA'),
            saveProductsToDB(telemartProducts, 'TELESMART'),
        ]);

        console.log('Products successfully saved to the database.');

        res.status(200).json({
            message: 'Scraping and saving completed successfully!',
            rozetka: rozetkaProducts,
            telemart: telemartProducts,
        });
    } catch (error) {
        console.error('Error during scraping process:', error);
        res.status(500).json({ error: 'Failed to scrape and save data.' });
    }
});

/**
 * @swagger
 * /api/telemart:
 *   post:
 *     summary: Launches scraping for Telemart.
 *     tags:
 *       - Scraping
 *     responses:
 *       200:
 *         description: Successfully received products from Telemart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scraping and saving completed successfully!
 *                 telemart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Комп'ютер HEXO Gaming RTX4060 Base"
 *                       subtitle:
 *                         type: string
 *                         example: "https://telemart.ua/ua/products/hexo-gaming-rtx4060-base-hgb-3600n4060-16s480bkdk-blackdark/"
 *                       description:
 *                         type: string
 *                         example: "No description available"
 *                       price:
 *                         type: number
 *                         example: 29999
 *                       specifications:
 *                         type: string
 *                         example: "{\"Процесор:\":\"AMD Ryzen 5 3600 (3.6–4.2 ГГц), 6 ядер\",\"Материнська плата:\":\"A520\",\"Відеокарта:\":\"RTX 4060, 8 ГБ\",\"Внутрішній накопичувач:\":\"Накопичувач SATA\",\"Оперативна пам'ять:\":\"16 ГБ, 3200 МГц (DDR4)\",\"Блок живлення:\":\"650 Вт\",\"Сертифікат блока живлення:\":\"Bronze\"}"
 *                       type:
 *                         type: string
 *                         example: "Компьютери"
 *                       profileImage:
 *                         type: string
 *                         example: "https://img.telemart.ua/561400-836185-category_page/hexo-gaming-rtx4060-base-hgb-3600n4060-16s480bkdk-blackdark.png"
 *                       link:
 *                         type: string
 *                         example: "https://telemart.ua/ua/products/hexo-gaming-rtx4060-base-hgb-3600n4060-16s480bkdk-blackdark/"
 *                       source:
 *                         type: string
 *                         example: "TELESMART"
 *       500:
 *         description: An error occurred while scraping or saving data.
 */

router.post('/telemart', async (req, res) => {
    try {
        console.log('Starting scraping for Telemart...');
        const telemartProducts = await scraperTelemart();

        console.log('Telemart Products Count:', telemartProducts.length);
        res.status(200).json(telemartProducts);
    } catch (error) {
        console.error('Error fetching Telemart products:', error);
        res.status(500).json({ error: 'Failed to fetch Telemart products.' });
    }
});

/**
 * @swagger
 * /api/rozetka:
 *   post:
 *     summary: Starts scraping for Rozetka.
 *     tags:
 *       - Scraping
 *     responses:
 *       200:
 *         description: Successfully received products from Rozetka.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Scraping and saving completed successfully!
 *                 rozetka:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         example: "Комп'ютер ARTLINE Gaming X43"
 *                       subtitle:
 *                         type: string
 *                         example: "https://hard.rozetka.com.ua/ua/artline-x43v45/p422114907/"
 *                       description:
 *                         type: string
 *                         example: "No description available"
 *                       price:
 *                         type: number
 *                         example: 23999
 *                       specifications:
 *                         type: string
 *                         example: "No specifications available"
 *                       type:
 *                         type: string
 *                         example: "Computer"
 *                       profileImage:
 *                         type: string
 *                         example: "https://content.rozetka.com.ua/goods/images/big_tile/416512630.jpg"
 *                       source:
 *                         type: string
 *                         example: "ROZETKA"
 *                       id:
 *                         type: integer
 *                         example: 1681
 *       500:
 *         description: An error occurred while scraping or saving data.
 */

router.post('/rozetka', async (req, res) => {
    try {
        console.log('Starting scraping for Rozetka...');
        const rozetkaProducts = await scraperRozetka();

        console.log('Rozetka Products Count:', rozetkaProducts.length);
        res.status(200).json(rozetkaProducts);
    } catch (error) {
        console.error('Error fetching Rozetka products:', error);
        res.status(500).json({ error: 'Failed to fetch Rozetka products.' });
    }
});

/**
 * @swagger
 * /api/getElement:
 *   get:
 *     summary: Gets all items from the database, including data from Rozetka and Telemart.
 *     tags:
 *       - Data Retrieval
 *     responses:
 *       200:
 *         description: Items successfully received.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rozetka:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1681
 *                       title:
 *                         type: string
 *                         example: "Комп'ютер ARTLINE Gaming X43"
 *                       subtitle:
 *                         type: string
 *                         example: "https://hard.rozetka.com.ua/ua/artline-x43v45/p422114907/"
 *                       description:
 *                         type: string
 *                         example: "No description available"
 *                       price:
 *                         type: number
 *                         example: 23999
 *                       specifications:
 *                         type: string
 *                         example: "No specifications available"
 *                       type:
 *                         type: string
 *                         example: "Computer"
 *                       profileImage:
 *                         type: string
 *                         example: "https://content.rozetka.com.ua/goods/images/big_tile/416512630.jpg"
 *                       source:
 *                         type: string
 *                         example: "ROZETKA"
 *                 telemart:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 54321
 *                       title:
 *                         type: string
 *                         example: "Комп'ютер HEXO Gaming RTX4060 Base"
 *                       subtitle:
 *                         type: string
 *                         example: "https://telemart.ua/ua/products/hexo-gaming-rtx4060-base-hgb-3600n4060-16s480bkdk-blackdark/"
 *                       description:
 *                         type: string
 *                         example: "No description available"
 *                       price:
 *                         type: number
 *                         example: 29999
 *                       specifications:
 *                         type: string
 *                         example: "{\"Процесор:\":\"AMD Ryzen 5 3600 (3.6–4.2 ГГц), 6 ядер\",\"Материнська плата:\":\"A520\",\"Відеокарта:\":\"RTX 4060, 8 ГБ\",\"Внутрішній накопичувач:\":\"Накопичувач SATA\",\"Оперативна пам'ять:\":\"16 ГБ, 3200 МГц (DDR4)\",\"Блок живлення:\":\"650 Вт\",\"Сертифікат блока живлення:\":\"Bronze\"}"
 *                       type:
 *                         type: string
 *                         example: "Компьютери"
 *                       profileImage:
 *                         type: string
 *                         example: "https://img.telemart.ua/561400-836185-category_page/hexo-gaming-rtx4060-base-hgb-3600n4060-16s480bkdk-blackdark.png"
 *                       link:
 *                         type: string
 *                         example: "https://telemart.ua/ua/products/hexo-gaming-rtx4060-base-hgb-3600n4060-16s480bkdk-blackdark/"
 *                       source:
 *                         type: string
 *                         example: "TELESMART"
 *       404:
 *         description: No items found.
 *       500:
 *         description: Error while retrieving data.
 */

router.get('/getElement', async (req, res) => {
    try {
        const element = await getAllElement();
        if (element === undefined || element.length === 0) {
            res.status(404).send('No element found with this route');
            return;
        }
        res.status(200).json(element);
    } catch (error) {
        console.log(`Error fetching element: ${error}`);
        res.status(500).send({ message: error });
    }
});

export default router;
