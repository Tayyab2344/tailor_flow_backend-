"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasurementService = void 0;
const db_1 = __importDefault(require("../../config/db"));
const errors_1 = require("../../utils/errors");
class MeasurementService {
    static async verifyCustomerBelongsToBusiness(customerId, businessId) {
        const customer = await db_1.default.customer.findFirst({
            where: { id: customerId, businessId, deletedAt: null },
        });
        if (!customer) {
            throw new errors_1.AppError('Customer not found or access denied', 404);
        }
    }
    static async createMeasurement(businessId, data) {
        await this.verifyCustomerBelongsToBusiness(data.customerId, businessId);
        return await db_1.default.measurement.create({
            data: {
                customerId: data.customerId,
                templateName: data.templateName,
                gender: data.gender,
                measurementData: data.measurementData,
                notes: data.notes,
                referenceImages: data.referenceImages,
            },
        });
    }
    static async getMeasurements(businessId, customerId) {
        // If customerId is provided, get for that customer, else get all for the business
        const where = {
            deletedAt: null,
            customer: {
                businessId,
                deletedAt: null,
            },
        };
        if (customerId) {
            where.customerId = customerId;
        }
        return await db_1.default.measurement.findMany({
            where,
            include: {
                customer: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    static async getMeasurementById(businessId, id) {
        const measurement = await db_1.default.measurement.findFirst({
            where: {
                id,
                deletedAt: null,
                customer: {
                    businessId,
                    deletedAt: null,
                },
            },
            include: {
                customer: true,
            },
        });
        if (!measurement) {
            throw new errors_1.AppError('Measurement record not found', 404);
        }
        return measurement;
    }
    static async updateMeasurement(businessId, id, data) {
        const measurement = await db_1.default.measurement.findFirst({
            where: {
                id,
                deletedAt: null,
                customer: {
                    businessId,
                    deletedAt: null,
                },
            },
        });
        if (!measurement) {
            throw new errors_1.AppError('Measurement record not found', 404);
        }
        return await db_1.default.measurement.update({
            where: { id },
            data,
        });
    }
    static async deleteMeasurement(businessId, id) {
        const measurement = await db_1.default.measurement.findFirst({
            where: {
                id,
                deletedAt: null,
                customer: {
                    businessId,
                    deletedAt: null,
                },
            },
        });
        if (!measurement) {
            throw new errors_1.AppError('Measurement record not found', 404);
        }
        return await db_1.default.measurement.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
exports.MeasurementService = MeasurementService;
