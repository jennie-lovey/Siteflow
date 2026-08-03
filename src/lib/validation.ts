import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().trim().min(1, "Project name is required"),
  projectType: z.string().trim().min(1, "Project type is required"),
  status: z.enum(["later", "pending", "ongoing", "completed"]),
  priority: z.enum(["high", "medium", "low"]),
});

export const estimateItemSchema = z.object({
  category: z.string().trim().min(1, "Category is required"),
  description: z.string().trim().optional().default(""),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative"),
});

export const expenseFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  category: z.enum(["labour", "materials", "feeding", "transportation", "misc", "unexpected"]),
  description: z.string().trim().optional().default(""),
  amount: z.coerce.number().min(0, "Amount cannot be negative"),
});

export const noteFormSchema = z.object({
  date: z.string().min(1, "Date is required"),
  work_done: z.string().trim().optional().default(""),
  remaining_work: z.string().trim().optional().default(""),
  delays_reason: z.string().trim().optional().default(""),
  general_update: z.string().trim().optional().default(""),
});

export const agreedPriceSchema = z.object({
  agreedPrice: z.coerce.number().min(0, "Amount cannot be negative").nullable(),
});
