"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
const authenticateUser = (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new errors_1.AppError('Authentication failed: Missing token', 401);
        }
        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET || 'tailorflow_jwt_secret_key_2026_premium_app';
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof errors_1.AppError) {
            return next(error);
        }
        if (error.name === 'TokenExpiredError') {
            return next(new errors_1.AppError('Token has expired', 401));
        }
        return next(new errors_1.AppError('Invalid token', 401));
    }
};
exports.authenticateUser = authenticateUser;
const authorizeRoles = (roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errors_1.AppError('Unauthorized access', 401));
        }
        if (!roles.includes(req.user.role)) {
            return next(new errors_1.AppError('Access denied: Insufficient permissions', 403));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
