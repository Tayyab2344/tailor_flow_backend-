"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const payment_service_1 = require("./payment.service");
const response_1 = require("../../utils/response");
const errors_1 = require("../../utils/errors");
class PaymentController {
    static create = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await payment_service_1.PaymentService.createPayment(businessId, req.body);
            return (0, response_1.sendSuccess)(res, 'Payment recorded successfully', data, 210);
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
            const orderId = req.query.orderId;
            const data = await payment_service_1.PaymentService.getPayments(businessId, orderId);
            return (0, response_1.sendSuccess)(res, 'Payments retrieved successfully', data);
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
            const data = await payment_service_1.PaymentService.getPaymentById(businessId, req.params.id);
            return (0, response_1.sendSuccess)(res, 'Payment details retrieved successfully', data);
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
            const data = await payment_service_1.PaymentService.updatePayment(businessId, req.params.id, req.body);
            return (0, response_1.sendSuccess)(res, 'Payment updated successfully', data);
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
            const data = await payment_service_1.PaymentService.deletePayment(businessId, req.params.id);
            return (0, response_1.sendSuccess)(res, 'Payment deleted successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.PaymentController = PaymentController;
