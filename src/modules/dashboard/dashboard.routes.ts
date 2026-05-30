import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticateUser, authorizeRoles } from '../../middleware/auth';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticateUser);
router.use(
  authorizeRoles([
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.RECEPTIONIST,
    UserRole.CASHIER,
  ])
);

// Stats
router.get('/stats', DashboardController.getStats);

// Analytics
router.get('/analytics/revenue', DashboardController.getRevenueAnalytics);
router.get('/analytics/orders', DashboardController.getOrdersAnalytics);
router.get('/analytics/employees', DashboardController.getEmployeesAnalytics);
router.get('/analytics/customers', DashboardController.getCustomersAnalytics);

export default router;
