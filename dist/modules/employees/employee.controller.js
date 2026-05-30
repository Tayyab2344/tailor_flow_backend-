"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
const employee_service_1 = require("./employee.service");
const response_1 = require("../../utils/response");
const errors_1 = require("../../utils/errors");
class EmployeeController {
    static create = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await employee_service_1.EmployeeService.createEmployee(businessId, req.body);
            return (0, response_1.sendSuccess)(res, 'Employee created successfully', data, 210);
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
            const data = await employee_service_1.EmployeeService.getEmployees(businessId);
            return (0, response_1.sendSuccess)(res, 'Employees retrieved successfully', data);
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
            const data = await employee_service_1.EmployeeService.getEmployeeById(businessId, req.params.id);
            return (0, response_1.sendSuccess)(res, 'Employee retrieved successfully', data);
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
            const data = await employee_service_1.EmployeeService.updateEmployee(businessId, req.params.id, req.body);
            return (0, response_1.sendSuccess)(res, 'Employee updated successfully', data);
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
            const data = await employee_service_1.EmployeeService.deleteEmployee(businessId, req.params.id);
            return (0, response_1.sendSuccess)(res, 'Employee soft-deleted successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.EmployeeController = EmployeeController;
