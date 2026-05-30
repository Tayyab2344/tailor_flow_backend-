import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validation';
import { authenticateUser } from '../../middleware/auth';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.post('/logout', AuthController.logout);
router.post('/refresh-token', validate(refreshTokenSchema), AuthController.refreshToken);
router.get('/profile', authenticateUser, AuthController.profile);

export default router;
