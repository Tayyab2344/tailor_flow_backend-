import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from './employee.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/errors';

export class EmployeeController {
  public static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await EmployeeService.createEmployee(businessId, req.body);
      return sendSuccess(res, 'Employee created successfully', data, 210);
    } catch (error) {
      return next(error);
    }
  };

  public static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await EmployeeService.getEmployees(businessId);
      return sendSuccess(res, 'Employees retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await EmployeeService.getEmployeeById(businessId, req.params.id);
      return sendSuccess(res, 'Employee retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await EmployeeService.updateEmployee(businessId, req.params.id, req.body);
      return sendSuccess(res, 'Employee updated successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await EmployeeService.deleteEmployee(businessId, req.params.id);
      return sendSuccess(res, 'Employee soft-deleted successfully', data);
    } catch (error) {
      return next(error);
    }
  };
}
