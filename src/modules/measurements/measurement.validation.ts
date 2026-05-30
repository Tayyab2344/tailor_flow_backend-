import { z } from 'zod';

export const createMeasurementSchema = z.object({
  body: z.object({
    customerId: z.string({ required_error: 'Customer ID is required' }).uuid('Invalid Customer ID format'),
    templateName: z.string({ required_error: 'Template name is required' }).min(1),
    gender: z.string({ required_error: 'Gender is required' }),
    measurementData: z.record(z.any(), { required_error: 'Measurement data (JSON) is required' }),
    notes: z.string().optional().nullable(),
    referenceImages: z.array(z.string().url('Invalid image URL')).optional().default([]),
  }),
});

export const updateMeasurementSchema = z.object({
  body: z.object({
    templateName: z.string().min(1).optional(),
    gender: z.string().optional(),
    measurementData: z.record(z.any()).optional(),
    notes: z.string().optional().nullable(),
    referenceImages: z.array(z.string().url('Invalid image URL')).optional(),
  }),
});
