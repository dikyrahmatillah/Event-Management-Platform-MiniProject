"use client";

import { ChangePasswordSection } from "@/features/profile/components/ChangePassword";
import { ProfileAvatar } from "@/features/profile/components/ProfileAvatar";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";
import { ProfileForm } from "@/features/profile/components/ProfileForm";
import { Separator } from "@/components/ui/atomic/separator";
import { Skeleton } from "@/components/ui/atomic/skeleton";
import { useProfile } from "@/features/profile/useProfile";
import { useUpdateProfile } from "@/features/profile/useUpdateProfile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import {
  profileFormSchema,
  ProfileFormValues,
} from "@/features/profile/schema/profile.schema";

export function ProfilePageContent() {
  const { profile, isLoading, imagePreview, setImagePreview } = useProfile();
  const { onSubmit, isSubmitting } = useUpdateProfile();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { firstName: "", lastName: "", email: "", phone: "" },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (profile) {
      form.reset({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
      });
    }
  }, [profile, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          View and manage your personal information
        </p>
      </div>
      <Separator />
      {isLoading ? (
        <div className="space-y-6">
          <div className="flex flex-col items-center md:flex-row gap-6">
            <Skeleton className="h-40 w-40 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <ProfileAvatar
            imagePreview={imagePreview}
            firstName={profile?.firstName}
            lastName={profile?.lastName}
            onImageChange={handleImageChange}
          />
          <div className="flex-1 space-y-6 mt-4 md:mt-0">
            <ProfileHeader
              firstName={profile?.firstName}
              lastName={profile?.lastName}
              role={profile?.role}
              email={profile?.email}
            />
            <ProfileForm
              form={form}
              isSubmitting={isSubmitting}
              onSubmit={(formData) => onSubmit(formData, selectedImage)}
            />
          </div>
        </div>
      )}
      <Separator className="my-6" />
      <div>
        <h3 className="text-xl font-semibold mb-4">Password Management</h3>
        <ChangePasswordSection />
      </div>
    </div>
  );
}
