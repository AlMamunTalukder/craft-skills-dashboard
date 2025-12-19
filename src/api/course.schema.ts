// src/api/course.schema.ts
import { z } from 'zod';

export const courseSchema = z.object({
 name: z.string().min(1, 'Course name is required'),
  description: z.string().optional(),
  price: z.coerce.number().min(0, 'Price must be at least 0'),
  discount: z.coerce.number().min(0).max(100).default(0),
  paymentCharge: z.coerce.number().min(0).default(0),
});

export type CourseFormData = z.infer<typeof courseSchema>;