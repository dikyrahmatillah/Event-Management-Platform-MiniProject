import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().max(100).optional(),
  email: z.email().optional(),
  phone: z
    .string()
    .regex(
      /^(?:\+62|62|0)8[1-9][0-9]{6,10}$/,
      "Invalid phone number format for Indonesian numbers (+62, 62, or 0 prefix) + 8XXXXXXXXXX"
    )
    .optional(),
  profilePicture: z.string().url().optional(),
  role: z.enum(["ORGANIZER", "CUSTOMER"]).optional(),
  referralCode: z.string().max(20).optional(),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
