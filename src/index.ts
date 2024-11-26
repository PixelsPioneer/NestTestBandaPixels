import express from 'express';
import { AppDataSource } from './backend/config/data-source';
import router from './backend/routes/scrapersRout';
import cors from 'cors';
import swaggerDocs from './swagger';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));

const PORT = 5000;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', router);

AppDataSource.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error initializing database:', error);
    });
