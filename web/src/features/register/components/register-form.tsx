"use client";

import { Label } from "@/components/ui/atomic/label";
import { Input } from "@/components/ui/atomic/input";
import { Button } from "@/components/ui/atomic/button";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchema } from "../schema/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type RegisterFormProps = {
  role: "CUSTOMER" | "ORGANIZER";
};

export default function RegisterForm({ role }: RegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(formData: RegisterSchema) {
    setIsSubmitting(true);
    try {
      if (role === "ORGANIZER") {
        formData.role = "ORGANIZER";
      }
      if (formData.phone === "") {
        delete formData.phone;
      }
      if (formData.profilePicture === "") {
        delete formData.profilePicture;
      }
      if (role === "CUSTOMER" && formData.referredByCode === "") {
        delete formData.referredByCode;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.message);
        setIsSubmitting(false);
        return;
      }

      toast.success("Registration successful! Logging you in...");

      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred during registration"
      );
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input type="text" id="firstName" {...register("firstName")} />
          {errors.firstName && <p>{errors.firstName.message}</p>}
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="lastName">Last Name (optional)</Label>
          <Input type="text" id="lastName" {...register("lastName")} />
          {errors.lastName && <p>{errors.lastName.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" {...register("email")} />
        {errors.email && <p>{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password")}
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground cursor-pointer"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input type="text" id="phone" {...register("phone")} />
        {errors.phone && <p>{errors.phone.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="profilePicture">Profile Picture (optional)</Label>
        <Input type="url" id="profilePicture" {...register("profilePicture")} />
        {errors.profilePicture && <p>{errors.profilePicture.message}</p>}
      </div>
      {role === "CUSTOMER" && (
        <div className="space-y-2">
          <Label htmlFor="referralCode">Referral Code (optional)</Label>
          <Input
            type="text"
            id="referralCode"
            {...register("referredByCode")}
          />
          {errors.referredByCode && <p>{errors.referredByCode.message}</p>}
        </div>
      )}
      <Button
        className="w-full cursor-pointer"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
