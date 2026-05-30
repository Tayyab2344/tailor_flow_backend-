"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQuerySchema = exports.patchTailorSchema = exports.patchStatusSchema = exports.updateOrderSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string({ required_error: 'Customer ID is required' }).uuid('Invalid Customer ID format'),
        measurementId: zod_1.z.string().uuid('Invalid Measurement ID format').optional().nullable(),
        assignedTailorId: zod_1.z.string().uuid('Invalid Tailor ID format').optional().nullable(),
        dressType: zod_1.z.string({ required_error: 'Dress type is required' }).min(1),
        fabricDetails: zod_1.z.string().optional().nullable(),
        quantity: zod_1.z.number().int().positive().optional().default(1),
        price: zod_1.z.number({ required_error: 'Price is required' }).positive(),
        advanceAmount: zod_1.z.number().nonnegative().optional().default(0),
        deliveryDate: zod_1.z.string({ required_error: 'Delivery date is required' }).datetime('Invalid delivery date format'),
        notes: zod_1.z.string().optional().nullable(),
    }),
});
exports.updateOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        customerId: zod_1.z.string().uuid().optional(),
        measurementId: zod_1.z.string().uuid().optional().nullable(),
        assignedTailorId: zod_1.z.string().uuid().optional().nullable(),
        dressType: zod_1.z.string().min(1).optional(),
        fabricDetails: zod_1.z.string().optional().nullable(),
        quantity: zod_1.z.number().int().positive().optional(),
        price: zod_1.z.number().positive().optional(),
        advanceAmount: zod_1.z.number().nonnegative().optional(),
        deliveryDate: zod_1.z.string().datetime().optional(),
        notes: zod_1.z.string().optional().nullable(),
    }),
});
exports.patchStatusSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.nativeEnum(client_1.OrderStatus, { required_error: 'Valid order status is required' }),
    }),
});
exports.patchTailorSchema = zod_1.z.object({
    body: zod_1.z.object({
        assignedTailorId: zod_1.z.string({ required_error: 'Tailor ID is required' }).uuid('Invalid Tailor ID format').nullable(),
    }),
});
exports.orderQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
        limit: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
        status: zod_1.z.nativeEnum(client_1.OrderStatus).optional(),
        customerId: zod_1.z.string().uuid().optional(),
        assignedTailorId: zod_1.z.string().uuid().optional(),
        search: zod_1.z.string().optional(),
    }),
});
