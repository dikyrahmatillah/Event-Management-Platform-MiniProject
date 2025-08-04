import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ProfileData } from "./useProfile";

export function useUpdateProfile() {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (
    formData: Partial<ProfileData>,
    selectedImage: File | null,
    onSuccess?: () => void
  ) => {
    setIsSubmitting(true);
    try {
      const token = session?.user?.accessToken;
      if (!token) throw new Error("Authentication token not found");
      const submitData = new FormData();
      if (formData.firstName)
        submitData.append("firstName", formData.firstName);
      if (formData.lastName) submitData.append("lastName", formData.lastName);
      if (formData.phone) submitData.append("phone", formData.phone);
      if (selectedImage) submitData.append("profilePicture", selectedImage);

      const res = await fetch(
        "http://localhost:8000/api/v1/auth/edit-profile",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: submitData,
        }
      );
      if (!res.ok)
        throw new Error(
          (await res.json()).message || "Failed to update profile"
        );
      toast.success("Profile updated successfully");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return { onSubmit, isSubmitting };
}
