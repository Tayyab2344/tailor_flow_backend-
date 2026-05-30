"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("./order.service");
const response_1 = require("../../utils/response");
const errors_1 = require("../../utils/errors");
class OrderController {
    static create = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            const userId = req.user?.userId;
            if (!businessId || !userId)
                throw new errors_1.AppError('Unauthorized', 401);
            const data = await order_service_1.OrderService.createOrder(businessId, userId, req.body);
            return (0, response_1.sendSuccess)(res, 'Order created successfully', data, 210);
        }
        catch (error) {
            return next(error);
        }
    };
    static getAll = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await order_service_1.OrderService.getOrders(businessId, req.query);
            return (0, response_1.sendSuccess)(res, 'Orders retrieved successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static getOne = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await order_service_1.OrderService.getOrderById(businessId, req.params.id);
            return (0, response_1.sendSuccess)(res, 'Order retrieved successfully', data);
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
            const data = await order_service_1.OrderService.updateOrder(businessId, req.params.id, req.body);
            return (0, response_1.sendSuccess)(res, 'Order updated successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static delete = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await order_service_1.OrderService.deleteOrder(businessId, req.params.id);
            return (0, response_1.sendSuccess)(res, 'Order soft-deleted successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static patchStatus = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            const userId = req.user?.userId;
            if (!businessId || !userId)
                throw new errors_1.AppError('Unauthorized', 401);
            const data = await order_service_1.OrderService.updateOrderStatus(businessId, userId, req.params.id, req.body.status);
            return (0, response_1.sendSuccess)(res, `Order status updated to ${req.body.status}`, data);
        }
        catch (error) {
            return next(error);
        }
    };
    static patchTailor = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await order_service_1.OrderService.assignTailor(businessId, req.params.id, req.body.assignedTailorId);
            return (0, response_1.sendSuccess)(res, 'Tailor assigned successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.OrderController = OrderController;
