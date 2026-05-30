"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const db_1 = __importDefault(require("../../config/db"));
const errors_1 = require("../../utils/errors");
class AuthService {
    static getJwtAccessSecret() {
        return process.env.JWT_SECRET || 'tailorflow_jwt_secret_key_2026_premium_app';
    }
    static getJwtRefreshSecret() {
        return process.env.JWT_REFRESH_SECRET || 'tailorflow_jwt_refresh_secret_key_2026_premium_app';
    }
    static generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.getJwtAccessSecret(), {
            expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m'),
        });
    }
    static generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.getJwtRefreshSecret(), {
            expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d'),
        });
    }
    static async register(data) {
        const { name, email, password, businessName } = data;
        // Check if user already exists
        const existingUser = await db_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new errors_1.AppError('Email address is already registered', 409);
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        // Prisma Transaction to create Business, Settings, and Admin User
        const result = await db_1.default.$transaction(async (tx) => {
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
                    role: client_1.UserRole.ADMIN,
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
                    role: client_1.UserRole.ADMIN,
                    status: 'ACTIVE',
                }
            });
            return { user, business };
        });
        const payload = {
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
    static async login(data) {
        const { email, password } = data;
        const user = await db_1.default.user.findUnique({
            where: { email },
            include: { business: true },
        });
        if (!user || user.deletedAt) {
            throw new errors_1.AppError('Invalid email or password', 401);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new errors_1.AppError('Invalid email or password', 401);
        }
        const payload = {
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
    static async refreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, this.getJwtRefreshSecret());
            const user = await db_1.default.user.findUnique({
                where: { id: decoded.userId },
            });
            if (!user || user.deletedAt) {
                throw new errors_1.AppError('User not found or suspended', 401);
            }
            const newPayload = {
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
        }
        catch (error) {
            throw new errors_1.AppError('Invalid or expired refresh token', 401);
        }
    }
    static async getProfile(userId) {
        const user = await db_1.default.user.findUnique({
            where: { id: userId },
            include: {
                business: true,
            },
        });
        if (!user || user.deletedAt) {
            throw new errors_1.AppError('User profile not found', 404);
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.AuthService = AuthService;
