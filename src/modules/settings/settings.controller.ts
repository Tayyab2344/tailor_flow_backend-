import { Request, Response, NextFunction } from 'express';
import { SettingsService } from './settings.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/errors';

export class SettingsController {
  public static get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await SettingsService.getSettings(businessId);
      return sendSuccess(res, 'Settings retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await SettingsService.updateSettings(businessId, req.body);
      return sendSuccess(res, 'Settings updated successfully', data);
    } catch (error) {
      return next(error);
    }
  };
}
