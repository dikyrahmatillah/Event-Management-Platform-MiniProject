import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/atomic/sidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole={session.user.role} />
      <SidebarInset className="flex flex-1 flex-col">{children}</SidebarInset>
    </SidebarProvider>
  );
}
