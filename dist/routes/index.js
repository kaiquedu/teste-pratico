"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/index.ts
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const confirmController_1 = require("../controllers/confirmController");
const listController_1 = require("../controllers/listController");
const router = (0, express_1.Router)();
router.post('/upload', uploadController_1.uploadImage);
router.patch('/confirm', confirmController_1.confirmMeasurement);
router.get('/:customer_code/list', listController_1.listMeasurements);
exports.default = router;
