import { Router } from 'express';
import { SettingsController } from './settings.controller';
import { validate } from '../../middleware/validate';
import { updateSettingsSchema } from './settings.validation';
import { authenticateUser, authorizeRoles } from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateUser);

router.get(
  '/',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
  SettingsController.get
);

router.put(
  '/',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
  validate(updateSettingsSchema),
  SettingsController.update
);

export default router;
