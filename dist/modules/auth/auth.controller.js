"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("./auth.service");
const response_1 = require("../../utils/response");
class AuthController {
    static register = async (req, res, next) => {
        try {
            const data = await auth_service_1.AuthService.register(req.body);
            return (0, response_1.sendSuccess)(res, 'User registered successfully', data, 210); // using standard 201 Created or custom
        }
        catch (error) {
            return next(error);
        }
    };
    static login = async (req, res, next) => {
        try {
            const data = await auth_service_1.AuthService.login(req.body);
            return (0, response_1.sendSuccess)(res, 'Login successful', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static logout = async (_req, res, next) => {
        try {
            // In stateless JWT setup, logout on client is deleting token. 
            // We can also return a success message indicating session terminated.
            return (0, response_1.sendSuccess)(res, 'Logged out successfully', {});
        }
        catch (error) {
            return next(error);
        }
    };
    static refreshToken = async (req, res, next) => {
        try {
            const { refreshToken } = req.body;
            const data = await auth_service_1.AuthService.refreshToken(refreshToken);
            return (0, response_1.sendSuccess)(res, 'Token refreshed successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
    static profile = async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new Error('Unauthorized');
            }
            const data = await auth_service_1.AuthService.getProfile(userId);
            return (0, response_1.sendSuccess)(res, 'Profile retrieved successfully', data);
        }
        catch (error) {
            return next(error);
        }
    };
}
exports.AuthController = AuthController;
