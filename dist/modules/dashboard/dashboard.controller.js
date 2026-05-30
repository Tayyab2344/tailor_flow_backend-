"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("./dashboard.service");
const response_1 = require("../../utils/response");
const errors_1 = require("../../utils/errors");
class DashboardController {
    static getStats = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await dashboard_service_1.DashboardService.getStats(businessId);
            return (0, response_1.sendSuccess)(res, 'Dashboard statistics retrieved successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static getRevenueAnalytics = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await dashboard_service_1.DashboardService.getRevenueAnalytics(businessId);
            return (0, response_1.sendSuccess)(res, 'Revenue analytics retrieved successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static getOrdersAnalytics = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await dashboard_service_1.DashboardService.getOrdersAnalytics(businessId);
            return (0, response_1.sendSuccess)(res, 'Orders analytics retrieved successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static getEmployeesAnalytics = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await dashboard_service_1.DashboardService.getEmployeesAnalytics(businessId);
            return (0, response_1.sendSuccess)(res, 'Employees analytics retrieved successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static getCustomersAnalytics = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await dashboard_service_1.DashboardService.getCustomersAnalytics(businessId);
            return (0, response_1.sendSuccess)(res, 'Customers analytics retrieved successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.DashboardController = DashboardController;
