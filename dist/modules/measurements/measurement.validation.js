"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMeasurementSchema = exports.createMeasurementSchema = void 0;
const zod_1 = require("zod");
exports.createMeasurementSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string({ required_error: 'Customer ID is required' }).uuid('Invalid Customer ID format'),
        templateName: zod_1.z.string({ required_error: 'Template name is required' }).min(1),
        gender: zod_1.z.string({ required_error: 'Gender is required' }),
        measurementData: zod_1.z.record(zod_1.z.any(), { required_error: 'Measurement data (JSON) is required' }),
        notes: zod_1.z.string().optional().nullable(),
        referenceImages: zod_1.z.array(zod_1.z.string().url('Invalid image URL')).optional().default([]),
    }),
});
exports.updateMeasurementSchema = zod_1.z.object({
    body: zod_1.z.object({
        templateName: zod_1.z.string().min(1).optional(),
        gender: zod_1.z.string().optional(),
        measurementData: zod_1.z.record(zod_1.z.any()).optional(),
        notes: zod_1.z.string().optional().nullable(),
        referenceImages: zod_1.z.array(zod_1.z.string().url('Invalid image URL')).optional(),
    }),
});
