import { AppDataSource } from './data-source';

export const connectDB = async (): Promise<void> => {
    AppDataSource
        .initialize()
        .then(() => {
            console.log('Connected to DB');
        })
        .catch((err) => {
            console.error(err);
        });
};