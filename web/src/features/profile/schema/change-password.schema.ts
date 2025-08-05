import { z } from "zod";

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8, "Old password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .regex(/[a-z]/, "At least one lowercase letter")
    .regex(/[A-Z]/, "At least one uppercase letter")
    .regex(/[0-9]/, "At least one number")
    .regex(/[\W_]/, "At least one special character"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
