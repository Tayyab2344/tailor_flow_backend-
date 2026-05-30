import { z } from 'zod';

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    phone: z.string({ required_error: 'Phone number is required' }).min(5, 'Phone number is too short'),
    email: z.string().email('Invalid email address').optional().nullable(),
    gender: z.string({ required_error: 'Gender is required' }),
    address: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    profileImage: z.string().url('Invalid image URL').optional().nullable(),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().min(5, 'Phone number is too short').optional(),
    email: z.string().email('Invalid email address').optional().nullable(),
    gender: z.string().optional(),
    address: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    profileImage: z.string().url('Invalid image URL').optional().nullable(),
  }),
});

export const customerQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    search: z.string().optional(),
    gender: z.string().optional(),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});
