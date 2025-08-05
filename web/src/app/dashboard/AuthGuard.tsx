// src/app/dashboard/AuthGuard.tsx
"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (status === "loading") return;

      if (status === "unauthenticated" || !session?.user?.accessToken) {
        toast.error("You must be logged in to access the dashboard.");
        router.push("/auth/sign-in");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:8000/api/v1/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${session.user.accessToken}`,
            },
          }
        );

        if (!response.ok) {
          toast.error("Your session has expired. Please sign in again.");
          await signOut({ redirect: false });
          router.push("/auth/sign-in");
          return;
        }

        setIsValidating(false);
      } catch (error) {
        console.error(error);
        toast.error("Authentication error. Please sign in again.");
        await signOut({ redirect: false });
        router.push("/auth/sign-in");
      }
    };

    validateToken();
  }, [status, session, router]);

  if (status === "loading" || isValidating) {
    return null;
  }

  return <>{children}</>;
}
