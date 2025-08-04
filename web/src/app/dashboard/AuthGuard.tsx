// src/app/dashboard/AuthGuard.tsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("You must be logged in to access the dashboard.");
      router.push("/auth/sign-in");
    }
  }, [status, router]);

  if (status === "loading") return null;

  return <>{children}</>;
}
