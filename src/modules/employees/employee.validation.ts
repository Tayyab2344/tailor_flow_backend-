import { z } from 'zod';
import { UserRole, EmployeeStatus } from '@prisma/client';

export const createEmployeeSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    phone: z.string({ required_error: 'Phone is required' }).min(5, 'Phone must be at least 5 characters'),
    role: z.nativeEnum(UserRole, { required_error: 'Valid role is required' }),
    status: z.nativeEnum(EmployeeStatus).optional().default(EmployeeStatus.ACTIVE),
    joinDate: z.string().datetime('Invalid join date format').optional(),
    profileImage: z.string().url('Invalid image URL').optional().nullable(),
    // Linked User login details (optional)
    email: z.string().email('Invalid email').optional().nullable(),
    password: z.string().min(6, 'Password must be at least 6 characters').optional().nullable(),
  }),
});

export const updateEmployeeSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    phone: z.string().min(5, 'Phone must be at least 5 characters').optional(),
    role: z.nativeEnum(UserRole).optional(),
    status: z.nativeEnum(EmployeeStatus).optional(),
    joinDate: z.string().datetime().optional(),
    profileImage: z.string().url('Invalid image URL').optional().nullable(),
  }),
});
