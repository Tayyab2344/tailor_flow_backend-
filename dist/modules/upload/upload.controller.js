"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const cloudinary_1 = require("../../config/cloudinary");
const response_1 = require("../../utils/response");
const errors_1 = require("../../utils/errors");
class UploadController {
    static uploadFile = async (req, res, next) => {
        try {
            if (!req.file) {
                throw new errors_1.AppError('No file provided in the request payload', 400);
            }
            const folder = req.query.folder || 'general';
            const fileUrl = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, folder);
            return (0, response_1.sendSuccess)(res, 'File uploaded successfully', {
                url: fileUrl,
                filename: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
            }, 210);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.UploadController = UploadController;
