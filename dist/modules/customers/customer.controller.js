"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const customer_service_1 = require("./customer.service");
const response_1 = require("../../utils/response");
const errors_1 = require("../../utils/errors");
class CustomerController {
    static create = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const data = await customer_service_1.CustomerService.createCustomer(businessId, req.body);
            return (0, response_1.sendSuccess)(res, 'Customer created successfully', data, 210);
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
            const data = await customer_service_1.CustomerService.getCustomers(businessId, req.query);
            return (0, response_1.sendSuccess)(res, 'Customers retrieved successfully', data);
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
            const data = await customer_service_1.CustomerService.getCustomerById(businessId, req.params.id);
            return (0, response_1.sendSuccess)(res, 'Customer retrieved successfully', data);
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
            const data = await customer_service_1.CustomerService.updateCustomer(businessId, req.params.id, req.body);
            return (0, response_1.sendSuccess)(res, 'Customer updated successfully', data);
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
            const data = await customer_service_1.CustomerService.deleteCustomer(businessId, req.params.id);
            return (0, response_1.sendSuccess)(res, 'Customer soft-deleted successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static search = async (req, res, next) => {
        try {
            const businessId = req.user?.businessId;
            if (!businessId)
                throw new errors_1.AppError('User is not associated with any business', 400);
            const searchVal = req.query.q || '';
            const data = await customer_service_1.CustomerService.getCustomers(businessId, {
                page: 1,
                limit: 20,
                search: searchVal,
                sortBy: 'name',
                sortOrder: 'asc'
            });
            return (0, response_1.sendSuccess)(res, 'Customers search retrieved successfully', data.customers);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.CustomerController = CustomerController;
