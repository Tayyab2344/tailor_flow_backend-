import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { validate } from '../../middleware/validate';
import { readNotificationSchema } from './notification.validation';
import { authenticateUser } from '../../middleware/auth';

const router = Router();

router.use(authenticateUser);

router.get('/', NotificationController.getAll);
router.patch('/:id/read', validate(readNotificationSchema), NotificationController.read);

export default router;
