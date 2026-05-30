import { Request, Response, NextFunction } from 'express';
import { PaymentService } from './payment.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/errors';

export class PaymentController {
  public static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await PaymentService.createPayment(businessId, req.body);
      return sendSuccess(res, 'Payment recorded successfully', data, 210);
    } catch (error) {
      return next(error);
    }
  };

  public static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const orderId = req.query.orderId as string;
      const data = await PaymentService.getPayments(businessId, orderId);
      return sendSuccess(res, 'Payments retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await PaymentService.getPaymentById(businessId, req.params.id);
      return sendSuccess(res, 'Payment details retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await PaymentService.updatePayment(businessId, req.params.id, req.body);
      return sendSuccess(res, 'Payment updated successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await PaymentService.deletePayment(businessId, req.params.id);
      return sendSuccess(res, 'Payment deleted successfully', data);
    } catch (error) {
      return next(error);
    }
  };
}
