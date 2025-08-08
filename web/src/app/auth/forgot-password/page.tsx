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
import { useForgotPassword } from "@/hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const { register, handleSubmit, errors, isLoading, onSubmit } =
    useForgotPassword();

  return (
    <main>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Forgot Password
              </CardTitle>
              <CardDescription className="text-center">
                Please enter your email to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    {...register("email")}
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                {errors.email && (
                  <div className="text-red-500 text-sm text-center mt-2">
                    {errors.email.message}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
