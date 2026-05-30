"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateEmployeeSchema = exports.createEmployeeSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createEmployeeSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
        phone: zod_1.z.string({ required_error: 'Phone is required' }).min(5, 'Phone must be at least 5 characters'),
        role: zod_1.z.nativeEnum(client_1.UserRole, { required_error: 'Valid role is required' }),
        status: zod_1.z.nativeEnum(client_1.EmployeeStatus).optional().default(client_1.EmployeeStatus.ACTIVE),
        joinDate: zod_1.z.string().datetime('Invalid join date format').optional(),
        profileImage: zod_1.z.string().url('Invalid image URL').optional().nullable(),
        // Linked User login details (optional)
        email: zod_1.z.string().email('Invalid email').optional().nullable(),
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters').optional().nullable(),
    }),
});
exports.updateEmployeeSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2, 'Name must be at least 2 characters').optional(),
        phone: zod_1.z.string().min(5, 'Phone must be at least 5 characters').optional(),
        role: zod_1.z.nativeEnum(client_1.UserRole).optional(),
        status: zod_1.z.nativeEnum(client_1.EmployeeStatus).optional(),
        joinDate: zod_1.z.string().datetime().optional(),
        profileImage: zod_1.z.string().url('Invalid image URL').optional().nullable(),
    }),
});
