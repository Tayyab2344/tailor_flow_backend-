import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/errors';

export class OrderController {
  public static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      const userId = req.user?.userId;
      if (!businessId || !userId) throw new AppError('Unauthorized', 401);

      const data = await OrderService.createOrder(businessId, userId, req.body);
      return sendSuccess(res, 'Order created successfully', data, 210);
    } catch (error) {
      return next(error);
    }
  };

  public static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await OrderService.getOrders(businessId, req.query);
      return sendSuccess(res, 'Orders retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await OrderService.getOrderById(businessId, req.params.id);
      return sendSuccess(res, 'Order retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await OrderService.updateOrder(businessId, req.params.id, req.body);
      return sendSuccess(res, 'Order updated successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await OrderService.deleteOrder(businessId, req.params.id);
      return sendSuccess(res, 'Order soft-deleted successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static patchStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      const userId = req.user?.userId;
      if (!businessId || !userId) throw new AppError('Unauthorized', 401);

      const data = await OrderService.updateOrderStatus(businessId, userId, req.params.id, req.body.status);
      return sendSuccess(res, `Order status updated to ${req.body.status}`, data);
    } catch (error) {
      return next(error);
    }
  };

  public static patchTailor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await OrderService.assignTailor(businessId, req.params.id, req.body.assignedTailorId);
      return sendSuccess(res, 'Tailor assigned successfully', data);
    } catch (error) {
      return next(error);
    }
  };
}
