import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Scraping API',
            version: '1.0.0',
            description: 'API для парсингу даних з Rozetka та Telemart',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['./src/backend/routes/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
export default swaggerDocs;
