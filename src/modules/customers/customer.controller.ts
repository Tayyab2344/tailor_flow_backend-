import { Request, Response, NextFunction } from 'express';
import { CustomerService } from './customer.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/errors';

export class CustomerController {
  public static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await CustomerService.createCustomer(businessId, req.body);
      return sendSuccess(res, 'Customer created successfully', data, 210);
    } catch (error) {
      return next(error);
    }
  };

  public static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await CustomerService.getCustomers(businessId, req.query);
      return sendSuccess(res, 'Customers retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await CustomerService.getCustomerById(businessId, req.params.id);
      return sendSuccess(res, 'Customer retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await CustomerService.updateCustomer(businessId, req.params.id, req.body);
      return sendSuccess(res, 'Customer updated successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await CustomerService.deleteCustomer(businessId, req.params.id);
      return sendSuccess(res, 'Customer soft-deleted successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const searchVal = req.query.q as string || '';
      const data = await CustomerService.getCustomers(businessId, {
        page: 1,
        limit: 20,
        search: searchVal,
        sortBy: 'name',
        sortOrder: 'asc'
      });
      return sendSuccess(res, 'Customers search retrieved successfully', data.customers);
    } catch (error) {
      return next(error);
    }
  };
}
