"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        password: zod_1.z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
        businessName: zod_1.z.string({ required_error: 'Business name is required' }).min(2, 'Business name must be at least 2 characters'),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string({ required_error: 'Email is required' }).email('Invalid email address'),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string({ required_error: 'Refresh token is required' }),
    }),
});
