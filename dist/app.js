"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source");
const routes_1 = __importDefault(require("./routes"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(express_1.default.json());
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error_code: 'PAYLOAD_TOO_LARGE', error_description: 'Payload too large' });
    }
    next(err);
});
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source initialized');
    app.use('/api', routes_1.default);
    app.listen(3000, () => {
        console.log('Server running on port 3000');
    });
})
    .catch((error) => console.log('Error initializing Data Source:', error));
