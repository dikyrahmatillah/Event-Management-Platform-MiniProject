import { z } from "zod";

export const searchSchema = z.object({
  query: z
    .string()
    .min(3, "Search minimum require 3 characters")
    .max(100, "⚠️ Maximum number of characters"),
});

export type SearchFormData = z.infer<typeof searchSchema>;
