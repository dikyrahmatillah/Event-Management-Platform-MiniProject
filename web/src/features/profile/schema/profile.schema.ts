import * as z from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z
    .string()
    .regex(/^(?:\+62|62|0)8[1-9][0-9]{6,10}$/)
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
