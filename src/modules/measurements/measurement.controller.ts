import { Request, Response, NextFunction } from 'express';
import { MeasurementService } from './measurement.service';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/errors';

export class MeasurementController {
  public static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await MeasurementService.createMeasurement(businessId, req.body);
      return sendSuccess(res, 'Measurement profile created successfully', data, 210);
    } catch (error) {
      return next(error);
    }
  };

  public static getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const customerId = req.query.customerId as string;
      const data = await MeasurementService.getMeasurements(businessId, customerId);
      return sendSuccess(res, 'Measurements retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await MeasurementService.getMeasurementById(businessId, req.params.id);
      return sendSuccess(res, 'Measurement retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await MeasurementService.updateMeasurement(businessId, req.params.id, req.body);
      return sendSuccess(res, 'Measurement updated successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const businessId = req.user?.businessId;
      if (!businessId) throw new AppError('User is not associated with any business', 400);

      const data = await MeasurementService.deleteMeasurement(businessId, req.params.id);
      return sendSuccess(res, 'Measurement soft-deleted successfully', data);
    } catch (error) {
      return next(error);
    }
  };
}
