"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const errors_1 = require("../../utils/errors");
const client_1 = require("@prisma/client");
class PaymentService {
    static async verifyOrderBelongsToBusiness(orderId, businessId) {
        const order = await db_1.default.order.findFirst({
            where: { id: orderId, businessId, deletedAt: null },
        });
        if (!order) {
            throw new errors_1.AppError('Order not found or access denied', 404);
        }
        return order;
    }
    static async createPayment(businessId, data) {
        const order = await this.verifyOrderBelongsToBusiness(data.orderId, businessId);
        const amount = new client_1.Prisma.Decimal(data.amount);
        return await db_1.default.$transaction(async (tx) => {
            // 1. Create Payment record
            const payment = await tx.payment.create({
                data: {
                    orderId: data.orderId,
                    amount,
                    paymentMethod: data.paymentMethod,
                    transactionReference: data.transactionReference,
                    notes: data.notes,
                },
            });
            // 2. Adjust Order remainingAmount
            const updatedRemaining = order.remainingAmount.sub(amount);
            await tx.order.update({
                where: { id: data.orderId },
                data: {
                    remainingAmount: updatedRemaining,
                },
            });
            return payment;
        });
    }
    static async getPayments(businessId, orderId) {
        const where = {
            deletedAt: null,
            order: {
                businessId,
                deletedAt: null,
            },
        };
        if (orderId) {
            where.orderId = orderId;
        }
        return await db_1.default.payment.findMany({
            where,
            include: {
                order: {
                    include: {
                        customer: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    static async getPaymentById(businessId, id) {
        const payment = await db_1.default.payment.findFirst({
            where: {
                id,
                deletedAt: null,
                order: {
                    businessId,
                    deletedAt: null,
                },
            },
            include: {
                order: {
                    include: {
                        customer: true,
                    },
                },
            },
        });
        if (!payment) {
            throw new errors_1.AppError('Payment record not found', 404);
        }
        return payment;
    }
    static async updatePayment(businessId, id, data) {
        const payment = await db_1.default.payment.findFirst({
            where: {
                id,
                deletedAt: null,
                order: {
                    businessId,
                    deletedAt: null,
                },
            },
            include: {
                order: true,
            },
        });
        if (!payment) {
            throw new errors_1.AppError('Payment record not found', 404);
        }
        const oldAmount = payment.amount;
        const newAmount = data.amount !== undefined ? new client_1.Prisma.Decimal(data.amount) : oldAmount;
        return await db_1.default.$transaction(async (tx) => {
            // 1. Update Payment record
            const updatedPayment = await tx.payment.update({
                where: { id },
                data: {
                    amount: newAmount,
                    paymentMethod: data.paymentMethod,
                    transactionReference: data.transactionReference,
                    notes: data.notes,
                },
            });
            // 2. Adjust Order remainingAmount
            // diff = oldAmount - newAmount
            // newRemaining = oldRemaining + diff
            const difference = oldAmount.sub(newAmount);
            const newRemaining = payment.order.remainingAmount.add(difference);
            await tx.order.update({
                where: { id: payment.orderId },
                data: {
                    remainingAmount: newRemaining,
                },
            });
            return updatedPayment;
        });
    }
    static async deletePayment(businessId, id) {
        const payment = await db_1.default.payment.findFirst({
            where: {
                id,
                deletedAt: null,
                order: {
                    businessId,
                    deletedAt: null,
                },
            },
            include: {
                order: true,
            },
        });
        if (!payment) {
            throw new errors_1.AppError('Payment record not found', 404);
        }
        return await db_1.default.$transaction(async (tx) => {
            // 1. Soft delete payment
            const deleted = await tx.payment.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
            // 2. Return payment amount back to order's remainingAmount
            const restoredRemaining = payment.order.remainingAmount.add(payment.amount);
            await tx.order.update({
                where: { id: payment.orderId },
                data: {
                    remainingAmount: restoredRemaining,
                },
            });
            return deleted;
        });
    }
}
exports.PaymentService = PaymentService;
