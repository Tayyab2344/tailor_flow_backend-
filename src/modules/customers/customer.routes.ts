import { Router } from 'express';
import { CustomerController } from './customer.controller';
import { validate } from '../../middleware/validate';
import { createCustomerSchema, updateCustomerSchema, customerQuerySchema } from './customer.validation';
import { authenticateUser, authorizeRoles } from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateUser);
router.use(authorizeRoles([UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST, UserRole.CASHIER]));

router.post('/', validate(createCustomerSchema), CustomerController.create);
router.get('/', validate(customerQuerySchema), CustomerController.getAll);
router.get('/search', CustomerController.search);
router.get('/:id', CustomerController.getOne);
router.put('/:id', validate(updateCustomerSchema), CustomerController.update);
router.delete('/:id', CustomerController.delete);

export default router;
