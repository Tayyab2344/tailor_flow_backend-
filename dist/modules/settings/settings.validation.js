"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettingsSchema = void 0;
const zod_1 = require("zod");
exports.updateSettingsSchema = zod_1.z.object({
    body: zod_1.z.object({
        workflowSettings: zod_1.z.record(zod_1.z.any()).optional(),
        currency: zod_1.z.string().optional(),
        language: zod_1.z.string().optional(),
        theme: zod_1.z.string().optional(),
        notificationSettings: zod_1.z.record(zod_1.z.any()).optional(),
        businessPreferences: zod_1.z.record(zod_1.z.any()).optional(),
    }),
});
