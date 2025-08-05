import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import { ChangePasswordInput } from "@/features/profile/schema/change-password.schema";

export function useChangePassword(form: UseFormReturn<ChangePasswordInput>) {
  const { data: session } = useSession();
  const [isChanging, setIsChanging] = useState(false);

  const onChangePassword = async (data: ChangePasswordInput) => {
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

  return { onChangePassword, isChanging };
}
