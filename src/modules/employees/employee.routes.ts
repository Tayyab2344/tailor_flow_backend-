import { Router } from 'express';
import { EmployeeController } from './employee.controller';
import { validate } from '../../middleware/validate';
import { createEmployeeSchema, updateEmployeeSchema } from './employee.validation';
import { authenticateUser, authorizeRoles } from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateUser);

router.post(
  '/',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
  validate(createEmployeeSchema),
  EmployeeController.create
);

router.get(
  '/',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST, UserRole.CASHIER]),
  EmployeeController.getAll
);

router.get(
  '/:id',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST]),
  EmployeeController.getOne
);

router.put(
  '/:id',
  authorizeRoles([UserRole.ADMIN, UserRole.MANAGER]),
  validate(updateEmployeeSchema),
  EmployeeController.update
);

router.delete(
  '/:id',
  authorizeRoles([UserRole.ADMIN]),
  EmployeeController.delete
);

export default router;
