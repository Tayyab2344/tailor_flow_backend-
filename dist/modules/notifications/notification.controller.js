"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_service_1 = require("./notification.service");
const response_1 = require("../../utils/response");
const errors_1 = require("../../utils/errors");
class NotificationController {
    static getAll = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId)
                throw new errors_1.AppError('Unauthorized', 401);
            const data = await notification_service_1.NotificationService.getNotifications(userId);
            return (0, response_1.sendSuccess)(res, 'Notifications retrieved successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static read = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId)
                throw new errors_1.AppError('Unauthorized', 401);
            const data = await notification_service_1.NotificationService.markAsRead(userId, req.params.id);
            return (0, response_1.sendSuccess)(res, 'Notification marked as read successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.NotificationController = NotificationController;
