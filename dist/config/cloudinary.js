"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const logger_1 = __importDefault(require("../utils/logger"));
const isConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';
if (isConfigured) {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    logger_1.default.info('Cloudinary configured successfully.');
}
else {
    logger_1.default.warn('Cloudinary environment variables missing or placeholders. Using mock/local storage fallback for file uploads.');
}
const uploadToCloudinary = async (fileBuffer, folder) => {
    if (!isConfigured) {
        // Return a mock URL or local path representation
        const randomId = Math.random().toString(36).substring(7);
        return `https://res.cloudinary.com/mock-cloud/image/upload/${folder}/mock_${randomId}.jpg`;
    }
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: `tailorflow/${folder}` }, (error, result) => {
            if (error) {
                logger_1.default.error('Cloudinary upload error:', error);
                return reject(error);
            }
            resolve(result?.secure_url || '');
        });
        uploadStream.end(fileBuffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
exports.default = cloudinary_1.v2;
