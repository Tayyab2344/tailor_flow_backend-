"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const errors_1 = require("../../utils/errors");
class CustomerService {
    static async createCustomer(businessId, data) {
        return await db_1.default.customer.create({
            data: {
                ...data,
                businessId,
            },
        });
    }
    static async getCustomers(businessId, query) {
        const { page, limit, search, gender, sortBy, sortOrder } = query;
        const skip = (page - 1) * limit;
        const where = {
            businessId,
            deletedAt: null,
        };
        if (gender) {
            where.gender = { equals: gender, mode: 'insensitive' };
        }
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }
        const [total, customers] = await db_1.default.$transaction([
            db_1.default.customer.count({ where }),
            db_1.default.customer.findMany({
                where,
                skip,
                take: limit,
                orderBy: {
                    [sortBy]: sortOrder,
                },
            }),
        ]);
        return {
            customers,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    static async getCustomerById(businessId, id) {
        const customer = await db_1.default.customer.findFirst({
            where: {
                id,
                businessId,
                deletedAt: null,
            },
            include: {
                measurements: {
                    where: { deletedAt: null }
                },
                orders: {
                    where: { deletedAt: null }
                }
            }
        });
        if (!customer) {
            throw new errors_1.AppError('Customer not found', 404);
        }
        return customer;
    }
    static async updateCustomer(businessId, id, data) {
        const customer = await db_1.default.customer.findFirst({
            where: { id, businessId, deletedAt: null },
        });
        if (!customer) {
            throw new errors_1.AppError('Customer not found', 404);
        }
        return await db_1.default.customer.update({
            where: { id },
            data,
        });
    }
    static async deleteCustomer(businessId, id) {
        const customer = await db_1.default.customer.findFirst({
            where: { id, businessId, deletedAt: null },
        });
        if (!customer) {
            throw new errors_1.AppError('Customer not found', 404);
        }
        return await db_1.default.customer.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
exports.CustomerService = CustomerService;
