import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Measure } from '../entity/Measure';

export async function listMeasurements(req: Request, res: Response) {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const measureRepository = AppDataSource.getRepository(Measure);

    const whereCondition: any = {
        customer_code: customer_code,
    };

    if (measure_type) {
        const typeUpperCase = measure_type.toString().toUpperCase();
        if (typeUpperCase !== 'WATER' && typeUpperCase !== 'GAS') {
            return res.status(400).json({
                error_code: "INVALID_TYPE",
                error_description: "Tipo de medição não permitida",
            });
        }
        whereCondition.measure_type = typeUpperCase;
    }

    try {
        const measures = await measureRepository.find({
            where: whereCondition,
            order: {
                measure_datetime: 'DESC',
            },
        });

        if (measures.length === 0) {
            return res.status(404).json({
                error_code: "MEASURES_NOT_FOUND",
                error_description: "Nenhuma leitura encontrada",
            });
        }

        return res.status(200).json({
            customer_code,
            measures,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error_code: "INTERNAL_SERVER_ERROR",
            error_description: "Erro interno do servidor",
        });
    }
}
