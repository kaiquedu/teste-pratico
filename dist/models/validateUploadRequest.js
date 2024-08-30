"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUploadRequest = void 0;
const validateUploadRequest = (body) => {
    const { image, customer_code, measure_datetime, measure_type } = body;
    if (typeof image !== 'string' || !/^[a-zA-Z0-9+/=]+$/.test(image)) {
        return 'Formato base64 inválido';
    }
    if (typeof customer_code !== 'string' || !customer_code.trim()) {
        return 'Código do cliente inválido';
    }
    if (!['WATER', 'GAS'].includes(measure_type)) {
        return 'Tipo de medição inválido';
    }
    const date = new Date(measure_datetime);
    if (isNaN(date.getTime())) {
        return 'Data de medição inválida. Deve estar no formato ISO 8601 (ex: "2024-08-01T10:00:00Z")';
    }
    return null;
};
exports.validateUploadRequest = validateUploadRequest;
