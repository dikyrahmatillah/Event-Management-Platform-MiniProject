import { z } from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(100, "First name cannot exceed 100 characters"),
  lastName: z
    .string()
    .max(100, "Last name cannot exceed 100 characters")
    .optional(),
  phone: z
    .string()
    .regex(/^(?:\+62|62|0)8[1-9][0-9]{6,10}$/, "Invalid phone number")
    .optional(),
  role: z.enum(["CUSTOMER", "ORGANIZER"]).default("CUSTOMER"),
  profilePicture: z.url("Profile picture must be a valid URL").optional(),
  referredByCode: z.string().optional(),
});
