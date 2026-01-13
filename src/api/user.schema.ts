// Update your user.schema.ts

import { z } from 'zod';

// Create base schema
const userBaseSchema = {
 name: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must not exceed 50 characters')
    .trim(),

  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .regex(/^(\+88)?01[3-9]\d{8}$/, 'Invalid Bangladeshi phone number format')
    .trim()
    .optional()
    .or(z.literal('')),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters')
    
    .optional()
    .or(z.literal('')),

  role: z.enum(['student', 'admin', 'teacher']),
  
  status: z.enum(['active', 'inactive', 'banned']),
  

};

// For form submission - with validation
export const userSchema = z.object(userBaseSchema)
  .refine((data) => data.email || data.phone, {
    message: 'Either email or phone number must be provided',
    path: ['email'],
  });

// For form initialization - all fields optional
export const userFormInitSchema = z.object({
  _id: z.string().optional(),
  ...userBaseSchema,
  name: userBaseSchema.name.optional(),
  role: userBaseSchema.role.optional(),
  status: userBaseSchema.status.optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
export type UserFormInitData = z.infer<typeof userFormInitSchema>;
