import { AppSidebar } from "@/features/dashboard/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/atomic/sidebar";
import SessionProviderWrapper from "./session-provider";
import AuthGuard from "./AuthGuard";
import DashboardNavbar from "@/components/ui/organism/dashboard-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SessionProviderWrapper>
        <AppSidebar />
        <AuthGuard>
          <SidebarInset className="flex flex-1 flex-col">
            <DashboardNavbar showSidebarTrigger={true} showBrandLogo={false} />
            {children}
          </SidebarInset>
        </AuthGuard>
      </SessionProviderWrapper>
    </SidebarProvider>
  );
}
