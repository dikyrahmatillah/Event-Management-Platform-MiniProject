import { AppSidebar } from "@/components/dashboard-components/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/atomic/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-1 flex-col">{children}</SidebarInset>
    </SidebarProvider>
  );
}
