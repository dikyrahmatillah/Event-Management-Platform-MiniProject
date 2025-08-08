"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/atomic/button";
import { Input } from "@/components/ui/atomic/input";
import { Label } from "@/components/ui/atomic/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { ChangePasswordInput, changePasswordSchema } from "@/types/auth.types";

export function ResetPasswordForm({ token }: { token: string }) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChangePasswordInput>({
    defaultValues: { newPassword: "" },
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password?token=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );
      if (!response.ok) throw new Error("Failed to change password");
      toast.success("Password changed successfully");
      form.reset();
    } catch (error) {
      toast.error("An error occurred while changing the password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNewPassword ? "text" : "password"}
            required
            placeholder="Enter your new password"
            {...form.register("newPassword")}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center px-1 text-muted-foreground cursor-pointer"
            onClick={() => setShowNewPassword((v) => !v)}
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {form.formState.errors.newPassword && (
          <div className="text-red-500 text-sm">
            {form.formState.errors.newPassword.message}
          </div>
        )}
      </div>
      <Button
        type="submit"
        className="w-full cursor-pointer"
        disabled={isLoading}
      >
        {isLoading ? "Changing..." : "Change Password"}
      </Button>
    </form>
  );
}
