import { z } from 'zod';
import { PaymentMethod } from '@prisma/client';

export const createPaymentSchema = z.object({
  body: z.object({
    orderId: z.string({ required_error: 'Order ID is required' }).uuid('Invalid Order ID format'),
    amount: z.number({ required_error: 'Payment amount is required' }).positive('Amount must be positive'),
    paymentMethod: z.nativeEnum(PaymentMethod, { required_error: 'Valid payment method is required' }),
    transactionReference: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

export const updatePaymentSchema = z.object({
  body: z.object({
    amount: z.number().positive('Amount must be positive').optional(),
    paymentMethod: z.nativeEnum(PaymentMethod).optional(),
    transactionReference: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});
