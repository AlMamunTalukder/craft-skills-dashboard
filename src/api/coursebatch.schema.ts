// src/api/coursebatch.schema.ts
import { z } from "zod";

export const batchSchema = z.object({
  name: z.string().min(1, "Batch name is required"),
  code: z.string().min(1, "Batch code is required"),
  description: z.string().optional(),
  registrationStart: z.string().min(1, "Start date is required"),
  registrationEnd: z.string().min(1, "End date is required"),
  facebookSecretGroup: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  messengerSecretGroup: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  // Remove isActive from the form schema since it's not needed in create page
});

export type BatchFormData = z.infer<typeof batchSchema>;

// Create a separate type for API (with isActive)
export type BatchApiData = BatchFormData & {
  isActive?: boolean;
};