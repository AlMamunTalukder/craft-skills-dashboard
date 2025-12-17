import { z } from 'zod';

export const seminarSchema = z.object({
  sl: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date: z.string().min(1, 'Date is required'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  link: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  facebookSecretGroup: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  whatsappSecretGroup: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  messengerSecretGroup: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  facebookPublicGroup: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  whatsappPublicGroup: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
  telegramGroup: z
    .string()
    .url('Must be a valid URL')
    .optional()
    .or(z.literal('')),
});

export type SeminarFormData = z.infer<typeof seminarSchema>;