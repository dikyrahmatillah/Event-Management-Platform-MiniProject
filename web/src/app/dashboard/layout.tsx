import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/atomic/sidebar";
import SessionProviderWrapper from "./session-provider";
import AuthGuard from "./AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SessionProviderWrapper>
        <AuthGuard>
          <SidebarInset className="flex flex-1 flex-col">
            {children}
          </SidebarInset>
        </AuthGuard>
      </SessionProviderWrapper>
    </SidebarProvider>
  );
}
