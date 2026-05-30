"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readNotificationSchema = void 0;
const zod_1 = require("zod");
exports.readNotificationSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string({ required_error: 'Notification ID is required' }).uuid('Invalid Notification ID format'),
    }),
});
