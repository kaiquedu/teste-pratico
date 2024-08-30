import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import { AppDataSource } from './data-source';
import routes from './routes';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.json());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error_code: 'PAYLOAD_TOO_LARGE', error_description: 'Payload too large' });
    }
    next(err);
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source initialized');
        app.use('/api', routes);

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    })
    .catch((error) => console.log('Error initializing Data Source:', error));
