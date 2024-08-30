// src/routes/index.ts
import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController';
import { confirmMeasurement } from '../controllers/confirmController';
import { listMeasurements } from '../controllers/listController';

const router = Router();

router.post('/upload', uploadImage);
router.patch('/confirm', confirmMeasurement);
router.get('/:customer_code/list', listMeasurements);

export default router;
