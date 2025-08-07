import { z } from "zod";

export const changePasswordSchema = z.object({
  newPassword: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
