import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  // Redirect based on user role
  const userRole = session.user.role;
  if (userRole === "ORGANIZER") {
    redirect("/dashboard/organizer");
  } else if (userRole === "CUSTOMER") {
    redirect("/dashboard/customer");
  }

  // Fallback to organizer if role is undefined
  redirect("/dashboard/organizer");
}
