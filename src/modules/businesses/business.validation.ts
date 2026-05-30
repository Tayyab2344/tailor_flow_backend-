import { z } from 'zod';

export const createBusinessSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Business name is required' }).min(2, 'Name must be at least 2 characters'),
    logo: z.string().url('Invalid logo URL').optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().email('Invalid email').optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    currency: z.string().optional(),
    language: z.string().optional(),
  }),
});

export const updateBusinessSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    logo: z.string().url('Invalid logo URL').optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().email('Invalid email').optional().nullable(),
    address: z.string().optional().nullable(),
    city: z.string().optional().nullable(),
    currency: z.string().optional(),
    language: z.string().optional(),
  }),
});
