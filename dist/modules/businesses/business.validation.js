"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBusinessSchema = exports.createBusinessSchema = void 0;
const zod_1 = require("zod");
exports.createBusinessSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Business name is required' }).min(2, 'Name must be at least 2 characters'),
        logo: zod_1.z.string().url('Invalid logo URL').optional().nullable(),
        phone: zod_1.z.string().optional().nullable(),
        email: zod_1.z.string().email('Invalid email').optional().nullable(),
        address: zod_1.z.string().optional().nullable(),
        city: zod_1.z.string().optional().nullable(),
        currency: zod_1.z.string().optional(),
        language: zod_1.z.string().optional(),
    }),
});
exports.updateBusinessSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
        logo: zod_1.z.string().url('Invalid logo URL').optional().nullable(),
        phone: zod_1.z.string().optional().nullable(),
        email: zod_1.z.string().email('Invalid email').optional().nullable(),
        address: zod_1.z.string().optional().nullable(),
        city: zod_1.z.string().optional().nullable(),
        currency: zod_1.z.string().optional(),
        language: zod_1.z.string().optional(),
    }),
});
