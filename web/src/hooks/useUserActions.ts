import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export const useUserActions = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const getUserInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();
      }

      await signOut({
        redirectTo: "/",
        callbackUrl: window.location.origin,
      });
    } catch (error) {
      console.error("Error during sign out:", error);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  const handleProfileClick = () => {
    if (user?.role === "ORGANIZER") {
      router.push("/dashboard/organizer/profile");
    } else {
      router.push("/dashboard/customer/profile");
    }
  };

  const handleDashboardClick = () => {
    if (user?.role === "ORGANIZER") {
      router.push("/dashboard/organizer");
    } else if (user?.role === "CUSTOMER") {
      router.push("/dashboard/customer");
    } else {
      router.push("/dashboard");
    }
  };

  return {
    user,
    getUserInitials,
    handleSignOut,
    handleProfileClick,
    handleDashboardClick,
  };
};
