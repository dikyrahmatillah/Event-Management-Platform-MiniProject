import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export interface ProfileData {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
  role?: string;
}

export function useProfile() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.accessToken) return;
    setIsLoading(true);
    fetch("http://localhost:8000/api/v1/auth/profile", {
      headers: { Authorization: `Bearer ${session.user.accessToken}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => {
        setProfile(data.data);
        if (data.data.profilePicture) setImagePreview(data.data.profilePicture);
      })
      .catch((err) => {
        toast.error("Failed to load profile data");
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, [session, status]);

  return { profile, setProfile, isLoading, imagePreview, setImagePreview };
}
