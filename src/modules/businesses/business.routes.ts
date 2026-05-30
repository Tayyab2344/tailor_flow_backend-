import { Router } from 'express';
import { BusinessController } from './business.controller';
import { validate } from '../../middleware/validate';
import { createBusinessSchema, updateBusinessSchema } from './business.validation';
import { authenticateUser, authorizeRoles } from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateUser);

router.post(
  '/',
  authorizeRoles([UserRole.ADMIN]),
  validate(createBusinessSchema),
  BusinessController.create
);

router.get(
  '/',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.TAILOR, UserRole.RECEPTIONIST, UserRole.CASHIER]),
  BusinessController.get
);

router.put(
  '/',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
  validate(updateBusinessSchema),
  BusinessController.update
);

router.delete(
  '/',
  authorizeRoles([UserRole.ADMIN]),
  BusinessController.delete
);

export default router;
