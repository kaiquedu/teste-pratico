"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const axios_1 = __importDefault(require("axios"));
const validateUploadRequest_1 = require("../models/validateUploadRequest");
const data_source_1 = require("../data-source");
const Measure_1 = require("../entity/Measure");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const uploadImage = async (req, res) => {
    try {
        console.log('Recebendo requisição de upload...');
        const { image, customer_code, measure_datetime, measure_type } = req.body;
        const validationError = (0, validateUploadRequest_1.validateUploadRequest)(req.body);
        if (validationError) {
            console.error('Erro de validação:', validationError);
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: validationError,
            });
        }
        console.log('Validação bem-sucedida.');
        const measureDate = new Date(measure_datetime);
        console.log('Verificando leituras existentes...');
        const existingReading = await checkExistingReading(customer_code, measure_type, measureDate);
        if (existingReading) {
            console.error('Leitura do mês já realizada.');
            return res.status(409).json({
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já realizada',
            });
        }
        console.log('Enviando imagem para API do Google Vision...');
        const visionResponse = await axios_1.default.post(`https://vision.googleapis.com/v1/images:annotate?key=${process.env.GEMINI_API_KEY}`, {
            requests: [
                {
                    image: {
                        content: image,
                    },
                    features: [
                        {
                            type: 'TEXT_DETECTION',
                            maxResults: 1,
                        },
                    ],
                },
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Resposta da API Google Vision recebida.');
        const measureValueText = visionResponse.data.responses[0].textAnnotations[0].description.trim();
        const lines = measureValueText.split('\n');
        let measureValue = null;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].toLowerCase().includes('leitura atual')) {
                measureValue = parseFloat(lines[i + 1].trim());
                break;
            }
        }
        if (measureValue === null || isNaN(measureValue)) {
            console.error('Erro na conversão do valor da medida:', measureValueText);
            return res.status(422).json({
                error_code: 'INVALID_MEASURE_VALUE',
                error_description: 'O valor da medida extraído não é um número válido',
            });
        }
        const imageUrl = 'URL da imagem gerada ou armazenada';
        const measureUuid = (0, uuid_1.v4)();
        console.log('Salvando leitura no banco de dados...');
        await saveReading(customer_code, measureDate, measure_type, measureValue, imageUrl, measureUuid);
        console.log('Leitura salva com sucesso.');
        return res.status(200).json({
            image_url: imageUrl,
            measure_value: measureValue,
            measure_uuid: measureUuid,
        });
    }
    catch (error) {
        console.error('Erro durante o upload:', error);
        if (axios_1.default.isAxiosError(error)) {
            console.error('Erro na API do Google Vision:', error.response?.data || error.message);
            return res.status(error.response?.status || 500).json({
                error_code: 'VISION_API_ERROR',
                error_description: error.response?.data || 'Erro na API do Google Vision',
            });
        }
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.uploadImage = uploadImage;
const checkExistingReading = async (customer_code, measure_type, measure_datetime) => {
    try {
        const monthStart = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth(), 1);
        const monthEnd = new Date(measure_datetime.getFullYear(), measure_datetime.getMonth() + 1, 0);
        const existingReading = await data_source_1.AppDataSource.getRepository(Measure_1.Measure).findOne({
            where: {
                customer_code,
                measure_type,
                measure_datetime: (0, typeorm_1.Between)(monthStart, monthEnd),
            },
        });
        return !!existingReading;
    }
    catch (error) {
        console.error('Erro ao verificar leituras existentes:', error);
        throw error;
    }
};
const saveReading = async (customer_code, measure_datetime, measure_type, measure_value, image_url, measure_uuid) => {
    try {
        const measure = new Measure_1.Measure();
        measure.customer_code = customer_code;
        measure.measure_datetime = measure_datetime;
        measure.measure_type = measure_type;
        measure.measure_value = measure_value;
        measure.image_url = image_url;
        measure.measure_uuid = measure_uuid;
        await data_source_1.AppDataSource.getRepository(Measure_1.Measure).save(measure);
    }
    catch (error) {
        console.error('Erro ao salvar leitura no banco de dados:', error);
        throw error;
    }
};
