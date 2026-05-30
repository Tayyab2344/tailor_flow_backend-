import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger';

const isConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  logger.info('Cloudinary configured successfully.');
} else {
  logger.warn('Cloudinary environment variables missing or placeholders. Using mock/local storage fallback for file uploads.');
}

export const uploadToCloudinary = async (fileBuffer: Buffer, folder: string): Promise<string> => {
  if (!isConfigured) {
    // Return a mock URL or local path representation
    const randomId = Math.random().toString(36).substring(7);
    return `https://res.cloudinary.com/mock-cloud/image/upload/${folder}/mock_${randomId}.jpg`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `tailorflow/${folder}` },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result?.secure_url || '');
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
