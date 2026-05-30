import { Router } from 'express';
import { OrderController } from './order.controller';
import { validate } from '../../middleware/validate';
import { createOrderSchema, updateOrderSchema, patchStatusSchema, patchTailorSchema, orderQuerySchema } from './order.validation';
import { authenticateUser, authorizeRoles } from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateUser);

router.post(
  '/',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST]),
  validate(createOrderSchema),
  OrderController.create
);

router.get(
  '/',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.TAILOR, UserRole.RECEPTIONIST, UserRole.CASHIER]),
  validate(orderQuerySchema),
  OrderController.getAll
);

router.get(
  '/:id',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.TAILOR, UserRole.RECEPTIONIST, UserRole.CASHIER]),
  OrderController.getOne
);

router.put(
  '/:id',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST]),
  validate(updateOrderSchema),
  OrderController.update
);

router.delete(
  '/:id',
  authorizeRoles([UserRole.ADMIN]),
  OrderController.delete
);

router.patch(
  '/:id/status',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.TAILOR, UserRole.RECEPTIONIST]),
  validate(patchStatusSchema),
  OrderController.patchStatus
);

router.patch(
  '/:id/assign-tailor',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
  validate(patchTailorSchema),
  OrderController.patchTailor
);

export default router;
