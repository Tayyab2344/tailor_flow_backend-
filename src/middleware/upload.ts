import multer from 'multer';
import { Request } from 'express';
import { AppError } from '../utils/errors';

// Store files in memory so we can stream them to Cloudinary or handle them in memory
const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'application/pdf'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new AppError('Invalid file type. Only JPG, JPEG, PNG, WEBP, and PDF are allowed.', 400));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});
