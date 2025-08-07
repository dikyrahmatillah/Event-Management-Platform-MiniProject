"use client";

import { Label } from "@/components/ui/atomic/label";
import { Input } from "@/components/ui/atomic/input";
import { Button } from "@/components/ui/atomic/button";
import { useForm } from "react-hook-form";
import { registerSchema, RegisterSchema } from "../schema/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type RegisterFormProps = {
  role: "CUSTOMER" | "ORGANIZER";
};

export default function RegisterForm({ role }: RegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
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

      // Remove profilePicture from form data since we'll handle it separately
      delete formData.profilePicture;

      if (role === "CUSTOMER" && formData.referredByCode === "") {
        delete formData.referredByCode;
      }

      // Create FormData for file upload
      const submitData = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          submitData.append(key, value.toString());
        }
      });

      // Append profile image if selected
      if (profileImage) {
        submitData.append("profilePicture", profileImage);
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          body: submitData, // Use FormData instead of JSON
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
        <div className="flex flex-col gap-4">
          {profileImagePreview ? (
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src={profileImagePreview}
                alt="Profile preview"
                fill
                className="object-cover rounded-full border-2 border-gray-200"
              />
              <button
                type="button"
                onClick={() => {
                  setProfileImage(null);
                  setProfileImagePreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload profile picture
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                if (file.size > 2 * 1024 * 1024) {
                  toast.error("File size must be less than 2MB");
                  return;
                }
                setProfileImage(file);
                setProfileImagePreview(URL.createObjectURL(file));
              }
            }}
            className="hidden"
            id="profilePictureUpload"
          />
          <Label
            htmlFor="profilePictureUpload"
            className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            Choose File
          </Label>
        </div>
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
