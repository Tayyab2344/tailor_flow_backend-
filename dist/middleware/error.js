"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const errors_1 = require("../utils/errors");
const response_1 = require("../utils/response");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    logger_1.default.error(`${req.method} ${req.path} - Error: ${err.message}`, { stack: err.stack });
    // Custom AppError
    if (err instanceof errors_1.AppError) {
        return (0, response_1.sendError)(res, err.message, err.errors, err.statusCode);
    }
    // Zod Validation Error
    if (err instanceof zod_1.ZodError) {
        const formattedErrors = err.errors.map((zErr) => ({
            field: zErr.path.join('.'),
            message: zErr.message,
        }));
        return (0, response_1.sendError)(res, 'Validation failed', formattedErrors, 400);
    }
    // Prisma Errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        const prismaErr = err;
        // Unique key violation
        if (prismaErr.code === 'P2002') {
            const target = prismaErr.meta?.target || [];
            return (0, response_1.sendError)(res, `Duplicate field value: ${target.join(', ')}`, [{ field: target.join(', '), message: 'Value must be unique' }], 409);
        }
        // Record not found
        if (prismaErr.code === 'P2025') {
            return (0, response_1.sendError)(res, prismaErr.message || 'Record not found', [], 404);
        }
    }
    // Generic fallback
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
    return (0, response_1.sendError)(res, message, [], 500);
};
exports.errorHandler = errorHandler;
