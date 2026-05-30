import { Request, Response, NextFunction } from 'express';
import { uploadToCloudinary } from '../../config/cloudinary';
import { sendSuccess } from '../../utils/response';
import { AppError } from '../../utils/errors';

export class UploadController {
  public static uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError('No file provided in the request payload', 400);
      }

      const folder = (req.query.folder as string) || 'general';
      const fileUrl = await uploadToCloudinary(req.file.buffer, folder);

      return sendSuccess(res, 'File uploaded successfully', {
        url: fileUrl,
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      }, 210);
    } catch (error) {
      return next(error);
    }
  };
}
