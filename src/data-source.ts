import { DataSource } from 'typeorm';
import { Measure } from './entity/Measure';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'water_gas_meter_db',
  synchronize: true,
  logging: false,
  entities: [Measure],
  migrations: [],
  subscribers: [],
});

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });