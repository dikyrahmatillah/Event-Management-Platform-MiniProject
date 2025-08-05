"use client";

import { Button } from "@/components/ui/atomic/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Input } from "@/components/ui/atomic/input";
import { Label } from "@/components/ui/atomic/label";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

const changePasswordSchema = z.object({
  newPassword: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showNewPassword, setShowNewPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordInput>({
    defaultValues: { newPassword: "" },
    resolver: zodResolver(changePasswordSchema),
  });
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: ChangePasswordInput) {
    try {
      setIsLoading(true);

      console.log(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reset-password?token=${token}`
      );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/reset-password?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      toast.success("Password changed successfully");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while changing the password.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Change Password
              </CardTitle>
              <CardDescription className="text-center">
                Please enter your new password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      required
                      placeholder="Enter your new password"
                      {...register("newPassword")}
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center px-1 text-muted-foreground cursor-pointer"
                      onClick={() => setShowNewPassword((v) => !v)}
                    >
                      {showNewPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <div className="text-red-500 text-sm">
                      {errors.newPassword.message}
                    </div>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Changing..." : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
