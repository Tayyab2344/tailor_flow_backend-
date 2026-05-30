"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_controller_1 = require("./dashboard.controller");
const auth_1 = require("../../middleware/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateUser);
router.use((0, auth_1.authorizeRoles)([
    client_1.UserRole.ADMIN,
    client_1.UserRole.MANAGER,
    client_1.UserRole.RECEPTIONIST,
    client_1.UserRole.CASHIER,
]));
// Stats
router.get('/stats', dashboard_controller_1.DashboardController.getStats);
// Analytics
router.get('/analytics/revenue', dashboard_controller_1.DashboardController.getRevenueAnalytics);
router.get('/analytics/orders', dashboard_controller_1.DashboardController.getOrdersAnalytics);
router.get('/analytics/employees', dashboard_controller_1.DashboardController.getEmployeesAnalytics);
router.get('/analytics/customers', dashboard_controller_1.DashboardController.getCustomersAnalytics);
exports.default = router;
