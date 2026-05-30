"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const errors_1 = require("../../utils/errors");
class NotificationService {
    static async getNotifications(userId) {
        return await db_1.default.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    static async markAsRead(userId, id) {
        const notification = await db_1.default.notification.findFirst({
            where: { id, userId },
        });
        if (!notification) {
            throw new errors_1.AppError('Notification not found', 404);
        }
        return await db_1.default.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
}
exports.NotificationService = NotificationService;
