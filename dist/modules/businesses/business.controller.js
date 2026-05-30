"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessController = void 0;
const business_service_1 = require("./business.service");
const response_1 = require("../../utils/response");
const errors_1 = require("../../utils/errors");
class BusinessController {
    static create = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId)
                throw new errors_1.AppError('Unauthorized', 401);
            const data = await business_service_1.BusinessService.createBusiness(userId, req.body);
            return (0, response_1.sendSuccess)(res, 'Business onboarded successfully', data, 210);
        }
        catch (error) {
            return next(error);
        }
    };
    static get = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            const data = await business_service_1.BusinessService.getBusiness(businessId || null);
            return (0, response_1.sendSuccess)(res, 'Business details retrieved successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static update = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            const data = await business_service_1.BusinessService.updateBusiness(businessId || null, req.body);
            return (0, response_1.sendSuccess)(res, 'Business updated successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static delete = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            const data = await business_service_1.BusinessService.deleteBusiness(businessId || null);
            return (0, response_1.sendSuccess)(res, 'Business soft-deleted successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.BusinessController = BusinessController;
