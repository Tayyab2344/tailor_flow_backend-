"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerQuerySchema = exports.updateCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
exports.createCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
        phone: zod_1.z.string({ required_error: 'Phone number is required' }).min(5, 'Phone number is too short'),
        email: zod_1.z.string().email('Invalid email address').optional().nullable(),
        gender: zod_1.z.string({ required_error: 'Gender is required' }),
        address: zod_1.z.string().optional().nullable(),
        notes: zod_1.z.string().optional().nullable(),
        profileImage: zod_1.z.string().url('Invalid image URL').optional().nullable(),
    }),
});
exports.updateCustomerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
        phone: zod_1.z.string().min(5, 'Phone number is too short').optional(),
        email: zod_1.z.string().email('Invalid email address').optional().nullable(),
        gender: zod_1.z.string().optional(),
        address: zod_1.z.string().optional().nullable(),
        notes: zod_1.z.string().optional().nullable(),
        profileImage: zod_1.z.string().url('Invalid image URL').optional().nullable(),
    }),
});
exports.customerQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
        limit: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
        search: zod_1.z.string().optional(),
        gender: zod_1.z.string().optional(),
        sortBy: zod_1.z.string().optional().default('createdAt'),
        sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('desc'),
    }),
});
