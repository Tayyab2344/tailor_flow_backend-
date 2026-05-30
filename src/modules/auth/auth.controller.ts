import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../utils/response';

export class AuthController {
  public static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await AuthService.register(req.body);
      return sendSuccess(res, 'User registered successfully', data, 210); // using standard 201 Created or custom
    } catch (error) {
      return next(error);
    }
  };

  public static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await AuthService.login(req.body);
      return sendSuccess(res, 'Login successful', data);
    } catch (error) {
      return next(error);
    }
  };

  public static logout = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      // In stateless JWT setup, logout on client is deleting token. 
      // We can also return a success message indicating session terminated.
      return sendSuccess(res, 'Logged out successfully', {});
    } catch (error) {
      return next(error);
    }
  };

  public static refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const data = await AuthService.refreshToken(refreshToken);
      return sendSuccess(res, 'Token refreshed successfully', data);
    } catch (error) {
      return next(error);
    }
  };

  public static profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        throw new Error('Unauthorized');
      }
      const data = await AuthService.getProfile(userId);
      return sendSuccess(res, 'Profile retrieved successfully', data);
    } catch (error) {
      return next(error);
    }
  };
}
