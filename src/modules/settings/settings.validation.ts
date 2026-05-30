import { z } from 'zod';

export const updateSettingsSchema = z.object({
  body: z.object({
    workflowSettings: z.record(z.any()).optional(),
    currency: z.string().optional(),
    language: z.string().optional(),
    theme: z.string().optional(),
    notificationSettings: z.record(z.any()).optional(),
    businessPreferences: z.record(z.any()).optional(),
  }),
});
