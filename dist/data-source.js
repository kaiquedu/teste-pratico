"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Measure_1 = require("./entity/Measure");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'db',
    port: 5432,
    username: 'user',
    password: 'password',
    database: 'water_gas_meter_db',
    synchronize: true,
    logging: false,
    entities: [Measure_1.Measure],
    migrations: [],
    subscribers: [],
});
exports.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
})
    .catch((err) => {
    console.error('Error during Data Source initialization:', err);
});
