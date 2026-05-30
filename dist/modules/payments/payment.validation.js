"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePaymentSchema = exports.createPaymentSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createPaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        orderId: zod_1.z.string({ required_error: 'Order ID is required' }).uuid('Invalid Order ID format'),
        amount: zod_1.z.number({ required_error: 'Payment amount is required' }).positive('Amount must be positive'),
        paymentMethod: zod_1.z.nativeEnum(client_1.PaymentMethod, { required_error: 'Valid payment method is required' }),
        transactionReference: zod_1.z.string().optional().nullable(),
        notes: zod_1.z.string().optional().nullable(),
    }),
});
exports.updatePaymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        amount: zod_1.z.number().positive('Amount must be positive').optional(),
        paymentMethod: zod_1.z.nativeEnum(client_1.PaymentMethod).optional(),
        transactionReference: zod_1.z.string().optional().nullable(),
        notes: zod_1.z.string().optional().nullable(),
    }),
});
