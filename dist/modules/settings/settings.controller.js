"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const settings_service_1 = require("./settings.service");
const response_1 = require("../../utils/response");
const errors_1 = require("../../utils/errors");
class SettingsController {
    static get = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await settings_service_1.SettingsService.getSettings(businessId);
            return (0, response_1.sendSuccess)(res, 'Settings retrieved successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static update = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await settings_service_1.SettingsService.updateSettings(businessId, req.body);
            return (0, response_1.sendSuccess)(res, 'Settings updated successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.SettingsController = SettingsController;
