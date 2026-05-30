import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import logger from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  logger.error(`${req.method} ${req.path} - Error: ${err.message}`, { stack: err.stack });

  // Custom AppError
  if (err instanceof AppError) {
    return sendError(res, err.message, err.errors, err.statusCode);
  }

  // Zod Validation Error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((zErr) => ({
      field: zErr.path.join('.'),
      message: zErr.message,
    }));
    return sendError(res, 'Validation failed', formattedErrors, 400);
  }

  // Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaErr = err as any;
    // Unique key violation
    if (prismaErr.code === 'P2002') {
      const target = (prismaErr.meta?.target as string[]) || [];
      return sendError(
        res,
        `Duplicate field value: ${target.join(', ')}`,
        [{ field: target.join(', '), message: 'Value must be unique' }],
        409
      );
    }
    // Record not found
    if (prismaErr.code === 'P2025') {
      return sendError(res, prismaErr.message || 'Record not found', [], 404);
    }
  }

  // Generic fallback
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  return sendError(res, message, [], 500);
};
