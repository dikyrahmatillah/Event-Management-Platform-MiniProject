import React, { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/atomic/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/atomic/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/atomic/form";
import { Input } from "@/components/ui/atomic/input";
import { ProfileFormInput } from "../schema/profile.schema";
import { Copy } from "lucide-react";

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormInput>;
  isSubmitting: boolean;
  onSubmit: (data: ProfileFormInput) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  form,
  isSubmitting,
  onSubmit,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="referralCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Referral Code</FormLabel>
              <FormControl>
                <div className="relative flex">
                  <Input
                    placeholder="Referral code"
                    {...field}
                    disabled
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => handleCopy(field.value ?? "")}
                    tabIndex={-1}
                  >
                    <Copy size={18} />
                  </button>
                </div>
              </FormControl>
              <FormMessage />
              {copied && (
                <span className="text-xs text-green-600">Copied!</span>
              )}
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                className="cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save Profile Changes</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save the changes to your profile?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <button
                    type="button"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded cursor-pointer"
                    disabled={isSubmitting}
                    onClick={() => formRef.current?.requestSubmit()}
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>
    </Form>
  );
};
