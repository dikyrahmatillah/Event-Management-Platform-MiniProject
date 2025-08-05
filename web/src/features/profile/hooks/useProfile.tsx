import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ProfileFormInput } from "../schema/profile.schema";

export function useProfile() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileFormInput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (status !== "authenticated" || !session?.user?.accessToken) return;
      setIsLoading(true);
      try {
        const res = await fetch("http://localhost:8000/api/v1/auth/profile", {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        });
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();

        setProfile(data.data);

        if (data.data.profilePicture) setImagePreview(data.data.profilePicture);
      } catch (err) {
        toast.error("Failed to load profile data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [session, status]);

  return { profile, setProfile, isLoading, imagePreview, setImagePreview };
}
