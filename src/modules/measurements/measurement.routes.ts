import { Router } from 'express';
import { MeasurementController } from './measurement.controller';
import { validate } from '../../middleware/validate';
import { createMeasurementSchema, updateMeasurementSchema } from './measurement.validation';
import { authenticateUser, authorizeRoles } from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateUser);
router.use(
  authorizeRoles([
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.TAILOR,
    UserRole.RECEPTIONIST,
  ])
);

router.post('/', validate(createMeasurementSchema), MeasurementController.create);
router.get('/', MeasurementController.getAll);
router.get('/:id', MeasurementController.getOne);
router.put('/:id', validate(updateMeasurementSchema), MeasurementController.update);
router.delete('/:id', MeasurementController.delete);

export default router;
