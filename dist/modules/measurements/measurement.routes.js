"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const measurement_controller_1 = require("./measurement.controller");
const validate_1 = require("../../middleware/validate");
const measurement_validation_1 = require("./measurement.validation");
const auth_1 = require("../../middleware/auth");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateUser);
router.use((0, auth_1.authorizeRoles)([
    client_1.UserRole.ADMIN,
    client_1.UserRole.MANAGER,
    client_1.UserRole.TAILOR,
    client_1.UserRole.RECEPTIONIST,
]));
router.post('/', (0, validate_1.validate)(measurement_validation_1.createMeasurementSchema), measurement_controller_1.MeasurementController.create);
router.get('/', measurement_controller_1.MeasurementController.getAll);
router.get('/:id', measurement_controller_1.MeasurementController.getOne);
router.put('/:id', (0, validate_1.validate)(measurement_validation_1.updateMeasurementSchema), measurement_controller_1.MeasurementController.update);
router.delete('/:id', measurement_controller_1.MeasurementController.delete);
exports.default = router;
