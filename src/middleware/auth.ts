import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import { AppError } from '../utils/errors';
import { UserPayload } from '../types';

export const authenticateUser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication failed: Missing token', 401);
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'tailorflow_jwt_secret_key_2026_premium_app';

    const decoded = jwt.verify(token, jwtSecret) as UserPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      return next(error);
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token has expired', 401));
    }
    return next(new AppError('Invalid token', 401));
  }
};

export const authorizeRoles = (roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Unauthorized access', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied: Insufficient permissions', 403));
    }

    next();
  };
};
