"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const db_1 = __importDefault(require("../../config/db"));
class SettingsService {
    static async getSettings(businessId) {
        let settings = await db_1.default.settings.findUnique({
            where: { businessId },
        });
        if (!settings) {
            // Lazy initialize default settings if missing
            settings = await db_1.default.settings.create({
                data: {
                    businessId,
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
                    notificationSettings: { sms: true, email: true, whatsapp: false },
                    businessPreferences: { enableInvoicePdf: true, defaultTaxRate: 0.05 }
                },
            });
        }
        return settings;
    }
    static async updateSettings(businessId, data) {
        const settings = await db_1.default.settings.findUnique({
            where: { businessId },
        });
        if (!settings) {
            // If missing, create instead of update
            return await db_1.default.settings.create({
                data: {
                    ...data,
                    businessId,
                },
            });
        }
        return await db_1.default.settings.update({
            where: { businessId },
            data,
        });
    }
}
exports.SettingsService = SettingsService;
