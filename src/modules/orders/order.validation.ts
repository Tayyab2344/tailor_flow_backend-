import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const createOrderSchema = z.object({
  body: z.object({
    customerId: z.string({ required_error: 'Customer ID is required' }).uuid('Invalid Customer ID format'),
    measurementId: z.string().uuid('Invalid Measurement ID format').optional().nullable(),
    assignedTailorId: z.string().uuid('Invalid Tailor ID format').optional().nullable(),
    dressType: z.string({ required_error: 'Dress type is required' }).min(1),
    fabricDetails: z.string().optional().nullable(),
    quantity: z.number().int().positive().optional().default(1),
    price: z.number({ required_error: 'Price is required' }).positive(),
    advanceAmount: z.number().nonnegative().optional().default(0),
    deliveryDate: z.string({ required_error: 'Delivery date is required' }).datetime('Invalid delivery date format'),
    notes: z.string().optional().nullable(),
  }),
});

export const updateOrderSchema = z.object({
  body: z.object({
    customerId: z.string().uuid().optional(),
    measurementId: z.string().uuid().optional().nullable(),
    assignedTailorId: z.string().uuid().optional().nullable(),
    dressType: z.string().min(1).optional(),
    fabricDetails: z.string().optional().nullable(),
    quantity: z.number().int().positive().optional(),
    price: z.number().positive().optional(),
    advanceAmount: z.number().nonnegative().optional(),
    deliveryDate: z.string().datetime().optional(),
    notes: z.string().optional().nullable(),
  }),
});

export const patchStatusSchema = z.object({
  body: z.object({
    status: z.nativeEnum(OrderStatus, { required_error: 'Valid order status is required' }),
  }),
});

export const patchTailorSchema = z.object({
  body: z.object({
    assignedTailorId: z.string({ required_error: 'Tailor ID is required' }).uuid('Invalid Tailor ID format').nullable(),
  }),
});

export const orderQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    status: z.nativeEnum(OrderStatus).optional(),
    customerId: z.string().uuid().optional(),
    assignedTailorId: z.string().uuid().optional(),
    search: z.string().optional(),
  }),
});
