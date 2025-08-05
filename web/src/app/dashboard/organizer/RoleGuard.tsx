"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles: string[];
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.role || !allowedRoles.includes(session.user.role)) {
      router.push("/organizer");
    }
  }, [status, session, allowedRoles, router]);

  if (status === "loading") return null;
  if (!session?.user?.role || !allowedRoles.includes(session.user.role))
    return null;

  return <>{children}</>;
}
