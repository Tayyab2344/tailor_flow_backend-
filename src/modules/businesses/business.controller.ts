import { Request, Response, NextFunction } from 'express';
import { BusinessService } from './business.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/errors';

export class BusinessController {
  public static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError('Unauthorized', 401);
      const data = await BusinessService.createBusiness(userId, req.body);
      return sendSuccess(res, 'Business onboarded successfully', data, 210);
    } catch (error) {
      return next(error);
    }
  };

  public static get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      const data = await BusinessService.getBusiness(businessId || null);
      return sendSuccess(res, 'Business details retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      const data = await BusinessService.updateBusiness(businessId || null, req.body);
      return sendSuccess(res, 'Business updated successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      const data = await BusinessService.deleteBusiness(businessId || null);
      return sendSuccess(res, 'Business soft-deleted successfully', data);
    } catch (error) {
      return next(error);
    }
  };
}
