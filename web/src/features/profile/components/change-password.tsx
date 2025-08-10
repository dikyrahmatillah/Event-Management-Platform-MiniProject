"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/atomic/form";
import { Input } from "@/components/ui/atomic/input";
import { Button } from "@/components/ui/atomic/button";
import { Form } from "@/components/ui/atomic/form";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import {
  ChangePasswordInput,
  changePasswordSchema,
} from "@/features/profile/schema/change-password.schema";
import { useChangePassword } from "@/features/profile/hooks/useChangePassword";
import { ConfirmDialog } from "@/features/dashboard/components/confirm-dialog";

export function ChangePasswordSection() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Add this

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { oldPassword: "", newPassword: "" },
  });

  const { onChangePassword, isChanging } = useChangePassword(form);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onChangePassword)}
        className="space-y-4 w-full"
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showOldPassword ? "text" : "password"}
                    placeholder="Old password"
                    {...field}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground cursor-pointer"
                    onClick={() => setShowOldPassword((v) => !v)}
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
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
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New password"
                    {...field}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground cursor-pointer"
                    onClick={() => setShowNewPassword((v) => !v)}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={isChanging}
            className="cursor-pointer"
            onClick={() => setIsDialogOpen(true)}
          >
            {isChanging ? "Changing..." : "Change Password"}
          </Button>
          <ConfirmDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            title="Confirm Password Change"
            description="Are you sure you want to change your password?"
            confirmLabel="Change Password"
            cancelLabel="Cancel"
            onConfirm={() => {
              formRef.current?.requestSubmit();
              setIsDialogOpen(false);
            }}
          />
        </div>
      </form>
    </Form>
  );
}
