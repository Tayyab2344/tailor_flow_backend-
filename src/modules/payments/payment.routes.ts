import { Router } from 'express';
import { PaymentController } from './payment.controller';
import { validate } from '../../middleware/validate';
import { createPaymentSchema, updatePaymentSchema } from './payment.validation';
import { authenticateUser, authorizeRoles } from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateUser);

router.post(
  '/',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST, UserRole.CASHIER]),
  validate(createPaymentSchema),
  PaymentController.create
);

router.get(
  '/',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST, UserRole.CASHIER]),
  PaymentController.getAll
);

router.get(
  '/:id',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST, UserRole.CASHIER]),
  PaymentController.getOne
);

router.put(
  '/:id',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER]),
  validate(updatePaymentSchema),
  PaymentController.update
);

router.delete(
  '/:id',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
  PaymentController.delete
);

export default router;
