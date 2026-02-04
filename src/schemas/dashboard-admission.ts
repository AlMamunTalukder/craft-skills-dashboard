// // schemas/dashboard-admission.ts
// import { z } from "zod";

// export const dashboardStudentSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   phone: z.string().min(11, "Phone must be at least 11 characters"),
//   email: z.string().email().optional().or(z.literal("")),
//   courseId: z.string().min(1, "Course is required"),
//   batchId: z.string().min(1, "Batch is required"),
  
//   // Use z.coerce.number() for form inputs
//   amount: z.coerce.number().min(0, "Amount must be positive"),
//   discountAmount: z.coerce.number().min(0, "Discount must be positive").default(0),
  
//   status: z.enum(["pending", "approved", "rejected", "waitlisted"]).default("pending"),
//   paymentStatus: z.enum(["pending", "partial", "paid", "cancelled"]).default("pending"),
// });

// export type DashboardStudentData = z.infer<typeof dashboardStudentSchema>;

// // components/AddStudentForm.tsx
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import type { Resolver } from "react-hook-form";

// const form = useForm<DashboardStudentData>({
//   // Type assertion fixes the TypeScript error
//   resolver: zodResolver(dashboardStudentSchema) as Resolver<DashboardStudentData>,
//   defaultValues: {
//     amount: 0,
//     discountAmount: 0,
//   },
// });

// // In your JSX
// <input  type="number"  {...form.register("amount", { valueAsNumber: true })}/>