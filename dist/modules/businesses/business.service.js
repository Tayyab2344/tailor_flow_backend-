"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const errors_1 = require("../../utils/errors");
class BusinessService {
    static async createBusiness(userId, data) {
        // Check if user already has a business
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new errors_1.AppError('User not found', 404);
        if (user.businessId) {
            throw new errors_1.AppError('User is already associated with a business', 400);
        }
        return await db_1.default.$transaction(async (tx) => {
            const business = await tx.business.create({
                data,
            });
            // Update user's business association
            await tx.user.update({
                where: { id: userId },
                data: { businessId: business.id },
            });
            // Create default settings
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
                    currency: data.currency || 'USD',
                    language: data.language || 'en',
                    theme: 'dark',
                    notificationSettings: { sms: true, email: true, whatsapp: false },
                    businessPreferences: { enableInvoicePdf: true, defaultTaxRate: 0.05 }
                }
            });
            return business;
        });
    }
    static async getBusiness(businessId) {
        if (!businessId) {
            throw new errors_1.AppError('User is not associated with any business', 400);
        }
        const business = await db_1.default.business.findUnique({
            where: { id: businessId },
        });
        if (!business || business.deletedAt) {
            throw new errors_1.AppError('Business not found or suspended', 404);
        }
        return business;
    }
    static async updateBusiness(businessId, data) {
        if (!businessId) {
            throw new errors_1.AppError('User is not associated with any business', 400);
        }
        const business = await db_1.default.business.findUnique({ where: { id: businessId } });
        if (!business || business.deletedAt) {
            throw new errors_1.AppError('Business not found', 404);
        }
        return await db_1.default.business.update({
            where: { id: businessId },
            data,
        });
    }
    static async deleteBusiness(businessId) {
        if (!businessId) {
            throw new errors_1.AppError('User is not associated with any business', 400);
        }
        const business = await db_1.default.business.findUnique({ where: { id: businessId } });
        if (!business || business.deletedAt) {
            throw new errors_1.AppError('Business not found or already deleted', 404);
        }
        // Soft delete business
        return await db_1.default.business.update({
            where: { id: businessId },
            data: { deletedAt: new Date() },
        });
    }
}
exports.BusinessService = BusinessService;
