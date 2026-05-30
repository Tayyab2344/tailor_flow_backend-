import { z } from 'zod';

export const readNotificationSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Notification ID is required' }).uuid('Invalid Notification ID format'),
  }),
});
