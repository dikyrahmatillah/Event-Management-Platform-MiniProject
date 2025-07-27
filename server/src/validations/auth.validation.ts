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

export const loginSchema = z.object({
  email: z.email("Invalid email format"),
  password: z.string({ error: "Password is required" }),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email format"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

export const updateProfileSchema = z.object({
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
  profilePicture: z.url("Profile picture must be a valid URL").optional(),
});

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long")
    .regex(/[a-z]/, "New password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "New password must contain at least one uppercase letter")
    .regex(/[0-9]/, "New password must contain at least one number")
    .regex(/[\W_]/, "New password must contain at least one special character"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
