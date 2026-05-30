"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeasurementController = void 0;
const measurement_service_1 = require("./measurement.service");
const response_1 = require("../../utils/response");
const errors_1 = require("../../utils/errors");
class MeasurementController {
    static create = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await measurement_service_1.MeasurementService.createMeasurement(businessId, req.body);
            return (0, response_1.sendSuccess)(res, 'Measurement profile created successfully', data, 210);
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
            const customerId = req.query.customerId;
            const data = await measurement_service_1.MeasurementService.getMeasurements(businessId, customerId);
            return (0, response_1.sendSuccess)(res, 'Measurements retrieved successfully', data);
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
            const data = await measurement_service_1.MeasurementService.getMeasurementById(businessId, req.params.id);
            return (0, response_1.sendSuccess)(res, 'Measurement retrieved successfully', data);
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
            const data = await measurement_service_1.MeasurementService.updateMeasurement(businessId, req.params.id, req.body);
            return (0, response_1.sendSuccess)(res, 'Measurement updated successfully', data);
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
            const data = await measurement_service_1.MeasurementService.deleteMeasurement(businessId, req.params.id);
            return (0, response_1.sendSuccess)(res, 'Measurement soft-deleted successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.MeasurementController = MeasurementController;
