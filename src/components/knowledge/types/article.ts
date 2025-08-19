
import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(10, "Summary must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.enum(["Maintenance", "Repair", "Adventures", "Modifications", "Tyres", "Technical", "General"]),
  sourceUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  originalFileUrl: z.string().optional(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
