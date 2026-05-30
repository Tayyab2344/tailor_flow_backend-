import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';
import prisma from '../../config/db';
import { AppError } from '../../utils/errors';
import { UserPayload } from '../../types';

export class AuthService {
  private static getJwtAccessSecret() {
    return process.env.JWT_SECRET || 'tailorflow_jwt_secret_key_2026_premium_app';
  }

  private static getJwtRefreshSecret() {
    return process.env.JWT_REFRESH_SECRET || 'tailorflow_jwt_refresh_secret_key_2026_premium_app';
  }

  private static generateAccessToken(payload: UserPayload): string {
    return jwt.sign(payload, this.getJwtAccessSecret(), {
      expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as any,
    });
  }

  private static generateRefreshToken(payload: UserPayload): string {
    return jwt.sign(payload, this.getJwtRefreshSecret(), {
      expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as any,
    });
  }

  public static async register(data: any) {
    const { name, email, password, businessName } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email address is already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prisma Transaction to create Business, Settings, and Admin User
    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Create Business
      const business = await tx.business.create({
        data: {
          name: businessName,
          currency: 'USD',
          language: 'en',
        },
      });

      // 2. Create default settings
      await tx.settings.create({
        data: {
          businessId: business.id,
          workflowSettings: {
            stages: [
              'PENDING',
              'MEASURING',
              'CUTTING',
              'STITCHING',
              'EMBROIDERY',
              'IRONING',
              'QUALITY_CHECK',
              'READY',
              'DELIVERED'
            ]
          },
          currency: 'USD',
          language: 'en',
          theme: 'dark',
          notificationSettings: {
            sms: true,
            email: true,
            whatsapp: false
          },
          businessPreferences: {
            enableInvoicePdf: true,
            defaultTaxRate: 0.05
          }
        }
      });

      // 3. Create Admin User
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: UserRole.ADMIN,
          businessId: business.id,
        },
      });

      // 4. Create Employee record for Admin
      await tx.employee.create({
        data: {
          businessId: business.id,
          userId: user.id,
          name: user.name,
          phone: '',
          role: UserRole.ADMIN,
          status: 'ACTIVE',
        }
      });

      return { user, business };
    });

    const payload: UserPayload = {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role,
      businessId: result.business.id,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    // Remove password field
    const { password: _, ...userWithoutPassword } = result.user;

    return {
      user: userWithoutPassword,
      business: result.business,
      accessToken,
      refreshToken,
    };
  }

  public static async login(data: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { business: true },
    });

    if (!user || user.deletedAt) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const payload: UserPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      businessId: user.businessId,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  public static async refreshToken(token: string) {
    try {
      const decoded = jwt.verify(token, this.getJwtRefreshSecret()) as UserPayload;
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.deletedAt) {
        throw new AppError('User not found or suspended', 401);
      }

      const newPayload: UserPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        businessId: user.businessId,
      };

      const accessToken = this.generateAccessToken(newPayload);
      const newRefreshToken = this.generateRefreshToken(newPayload);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new AppError('Invalid or expired refresh token', 401);
    }
  }

  public static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        business: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new AppError('User profile not found', 404);
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
