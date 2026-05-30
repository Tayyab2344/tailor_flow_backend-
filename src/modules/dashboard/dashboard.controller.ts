import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './dashboard.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/errors';

export class DashboardController {
  public static getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await DashboardService.getStats(businessId);
      return sendSuccess(res, 'Dashboard statistics retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static getRevenueAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await DashboardService.getRevenueAnalytics(businessId);
      return sendSuccess(res, 'Revenue analytics retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static getOrdersAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await DashboardService.getOrdersAnalytics(businessId);
      return sendSuccess(res, 'Orders analytics retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static getEmployeesAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await DashboardService.getEmployeesAnalytics(businessId);
      return sendSuccess(res, 'Employees analytics retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static getCustomersAnalytics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await DashboardService.getCustomersAnalytics(businessId);
      return sendSuccess(res, 'Customers analytics retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };
}
