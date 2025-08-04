"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/atomic/input";
import { Button } from "@/components/ui/atomic/button";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import {
  changePasswordSchema,
  ChangePasswordValues,
} from "@/features/profile/schema/change-password.schema";

export function ChangePasswordSection() {
  const { data: session } = useSession();
  const [isChanging, setIsChanging] = useState(false);

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  const onChangePassword = async (data: ChangePasswordValues) => {
    setIsChanging(true);
    try {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Authentication token not found");
      const res = await fetch(
        "http://localhost:8000/api/v1/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok)
        throw new Error(
          (await res.json()).message || "Failed to change password"
        );
      toast.success("Password changed successfully");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to change password"
      );
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onChangePassword)}
        className="space-y-4 max-w-md"
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Old password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="New password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isChanging}>
            {isChanging ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
