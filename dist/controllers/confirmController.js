"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmMeasurement = void 0;
const data_source_1 = require("../data-source");
const Measure_1 = require("../entity/Measure");
const uuid_1 = require("uuid");
const confirmMeasurement = async (req, res) => {
    const { measure_uuid, confirmed_value } = req.body;
    if (!measure_uuid || !(0, uuid_1.validate)(measure_uuid) || typeof confirmed_value !== 'number') {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'measure_uuid ou confirmed_value inválidos',
        });
    }
    const measureRepository = data_source_1.AppDataSource.getRepository(Measure_1.Measure);
    try {
        const measure = await measureRepository.findOne({ where: { measure_uuid } });
        if (!measure) {
            return res.status(404).json({
                error_code: 'MEASURE_NOT_FOUND',
                error_description: 'Leitura não encontrada',
            });
        }
        if (measure.has_confirmed) {
            return res.status(409).json({
                error_code: 'CONFIRMATION_DUPLICATE',
                error_description: 'Leitura já confirmada',
            });
        }
        measure.measure_value = confirmed_value;
        measure.has_confirmed = true;
        await measureRepository.save(measure);
        return res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Erro ao confirmar leitura:', error);
        return res.status(500).json({
            error_code: 'INTERNAL_ERROR',
            error_description: 'Ocorreu um erro ao processar a solicitação.',
        });
    }
};
exports.confirmMeasurement = confirmMeasurement;
