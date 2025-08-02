"use client";

import { Label } from "@/components/ui/atomic/label";
import { Input } from "@/components/ui/atomic/input";
import { Button } from "@/components/ui/atomic/button";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchema } from "../schema/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(formData: RegisterSchema) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        console.error("Registration failed:", data.message);
        return;
      }

      console.log("Registration successfuly");
      reset();
    } catch (error) {
      console.error("Registration failed:", error);
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
        <Input type="password" id="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input type="text" id="phone" {...register("phone")} />
        {errors.phone && <p>{errors.phone.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="profilePicture">Profile Picture</Label>
        <Input type="url" id="profilePicture" {...register("profilePicture")} />
        {errors.profilePicture && <p>{errors.profilePicture.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="referralCode">Referral Code (optional)</Label>
        <Input type="text" id="referralCode" {...register("referredByCode")} />
        {errors.referredByCode && <p>{errors.referredByCode.message}</p>}
      </div>
      <Button className="w-full cursor-pointer" type="submit">
        Register
      </Button>
    </form>
  );
}
