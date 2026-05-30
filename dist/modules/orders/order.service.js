"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const errors_1 = require("../../utils/errors");
const client_1 = require("@prisma/client");
class OrderService {
    static async verifyAccess(businessId, customerId, tailorId) {
        const customer = await db_1.default.customer.findFirst({
            where: { id: customerId, businessId, deletedAt: null },
        });
        if (!customer) {
            throw new errors_1.AppError('Customer not found or access denied', 404);
        }
        if (tailorId) {
            const tailor = await db_1.default.employee.findFirst({
                where: { id: tailorId, businessId, deletedAt: null },
            });
            if (!tailor) {
                throw new errors_1.AppError('Assigned tailor not found in this business', 404);
            }
        }
    }
    static async createOrder(businessId, userId, data) {
        await this.verifyAccess(businessId, data.customerId, data.assignedTailorId);
        const price = new client_1.Prisma.Decimal(data.price);
        const quantity = data.quantity || 1;
        const advanceAmount = new client_1.Prisma.Decimal(data.advanceAmount || 0);
        const totalPrice = price.mul(quantity);
        const remainingAmount = totalPrice.sub(advanceAmount);
        return await db_1.default.$transaction(async (tx) => {
            // 1. Create order
            const order = await tx.order.create({
                data: {
                    businessId,
                    customerId: data.customerId,
                    measurementId: data.measurementId,
                    assignedTailorId: data.assignedTailorId,
                    dressType: data.dressType,
                    fabricDetails: data.fabricDetails,
                    quantity,
                    price,
                    advanceAmount,
                    remainingAmount,
                    status: client_1.OrderStatus.PENDING,
                    deliveryDate: new Date(data.deliveryDate),
                    notes: data.notes,
                },
            });
            // 2. Create timeline record
            await tx.orderTimeline.create({
                data: {
                    orderId: order.id,
                    previousStatus: null,
                    newStatus: client_1.OrderStatus.PENDING,
                    updatedBy: userId,
                },
            });
            // 3. Create payment record if advance amount > 0
            if (advanceAmount.greaterThan(0)) {
                await tx.payment.create({
                    data: {
                        orderId: order.id,
                        amount: advanceAmount,
                        paymentMethod: 'CASH', // default
                        notes: 'Advance payment recorded at order creation',
                    },
                });
            }
            return order;
        });
    }
    static async getOrders(businessId, query) {
        const { page, limit, status, customerId, assignedTailorId, search } = query;
        const skip = (page - 1) * limit;
        const where = {
            businessId,
            deletedAt: null,
        };
        if (status) {
            where.status = status;
        }
        if (customerId) {
            where.customerId = customerId;
        }
        if (assignedTailorId) {
            where.assignedTailorId = assignedTailorId;
        }
        if (search) {
            where.OR = [
                { dressType: { contains: search, mode: 'insensitive' } },
                { customer: { name: { contains: search, mode: 'insensitive' } } },
                { customer: { phone: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [total, orders] = await db_1.default.$transaction([
            db_1.default.order.count({ where }),
            db_1.default.order.findMany({
                where,
                skip,
                take: limit,
                include: {
                    customer: true,
                    assignedTailor: true,
                },
                orderBy: {
                    deliveryDate: 'asc',
                },
            }),
        ]);
        return {
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getOrderById(businessId, id) {
        const order = await db_1.default.order.findFirst({
            where: { id, businessId, deletedAt: null },
            include: {
                customer: true,
                measurement: true,
                assignedTailor: true,
                payments: { where: { deletedAt: null } },
                timelines: {
                    include: {
                        updatedByUser: {
                            select: { name: true, email: true, role: true },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!order) {
            throw new errors_1.AppError('Order not found', 404);
        }
        return order;
    }
    static async updateOrder(businessId, id, data) {
        const order = await db_1.default.order.findFirst({
            where: { id, businessId, deletedAt: null },
        });
        if (!order) {
            throw new errors_1.AppError('Order not found', 404);
        }
        // Verify relations if being changed
        const customerId = data.customerId || order.customerId;
        const tailorId = data.assignedTailorId !== undefined ? data.assignedTailorId : order.assignedTailorId;
        await this.verifyAccess(businessId, customerId, tailorId);
        // Calculate amounts
        const price = data.price !== undefined ? new client_1.Prisma.Decimal(data.price) : order.price;
        const quantity = data.quantity !== undefined ? data.quantity : order.quantity;
        const advanceAmount = data.advanceAmount !== undefined ? new client_1.Prisma.Decimal(data.advanceAmount) : order.advanceAmount;
        const totalPrice = price.mul(quantity);
        const remainingAmount = totalPrice.sub(advanceAmount);
        return await db_1.default.order.update({
            where: { id },
            data: {
                customerId: data.customerId,
                measurementId: data.measurementId,
                assignedTailorId: data.assignedTailorId,
                dressType: data.dressType,
                fabricDetails: data.fabricDetails,
                quantity,
                price,
                advanceAmount,
                remainingAmount,
                deliveryDate: data.deliveryDate ? new Date(data.deliveryDate) : undefined,
                notes: data.notes,
            },
        });
    }
    static async deleteOrder(businessId, id) {
        const order = await db_1.default.order.findFirst({
            where: { id, businessId, deletedAt: null },
        });
        if (!order) {
            throw new errors_1.AppError('Order not found', 404);
        }
        return await db_1.default.order.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    static async updateOrderStatus(businessId, userId, id, newStatus) {
        const order = await db_1.default.order.findFirst({
            where: { id, businessId, deletedAt: null },
        });
        if (!order) {
            throw new errors_1.AppError('Order not found', 404);
        }
        if (order.status === newStatus) {
            return order; // No change
        }
        return await db_1.default.$transaction(async (tx) => {
            // 1. Update status
            const updatedOrder = await tx.order.update({
                where: { id },
                data: { status: newStatus },
            });
            // 2. Append timeline entry
            await tx.orderTimeline.create({
                data: {
                    orderId: id,
                    previousStatus: order.status,
                    newStatus,
                    updatedBy: userId,
                },
            });
            return updatedOrder;
        });
    }
    static async assignTailor(businessId, id, assignedTailorId) {
        const order = await db_1.default.order.findFirst({
            where: { id, businessId, deletedAt: null },
        });
        if (!order) {
            throw new errors_1.AppError('Order not found', 404);
        }
        if (assignedTailorId) {
            const tailor = await db_1.default.employee.findFirst({
                where: { id: assignedTailorId, businessId, deletedAt: null },
            });
            if (!tailor) {
                throw new errors_1.AppError('Employee not found or access denied', 404);
            }
        }
        return await db_1.default.order.update({
            where: { id },
            data: { assignedTailorId },
        });
    }
}
exports.OrderService = OrderService;
