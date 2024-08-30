import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Measure } from '../entity/Measure';
import { validate as isUUID } from 'uuid'; 

export const confirmMeasurement = async (req: Request, res: Response) => {
    const { measure_uuid, confirmed_value } = req.body;

    if (!measure_uuid || !isUUID(measure_uuid) || typeof confirmed_value !== 'number') {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'measure_uuid ou confirmed_value inválidos',
        });
    }

    const measureRepository = AppDataSource.getRepository(Measure);
    
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
    } catch (error) {
        console.error('Erro ao confirmar leitura:', error);
        return res.status(500).json({
            error_code: 'INTERNAL_ERROR',
            error_description: 'Ocorreu um erro ao processar a solicitação.',
        });
    }
};
