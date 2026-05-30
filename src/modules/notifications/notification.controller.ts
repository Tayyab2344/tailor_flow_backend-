import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './notification.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/errors';

export class NotificationController {
  public static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError('Unauthorized', 401);

      const data = await NotificationService.getNotifications(userId);
      return sendSuccess(res, 'Notifications retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static read = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new AppError('Unauthorized', 401);

      const data = await NotificationService.markAsRead(userId, req.params.id);
      return sendSuccess(res, 'Notification marked as read successfully', data);
    } catch (error) {
      return next(error);
    }
  };
}
