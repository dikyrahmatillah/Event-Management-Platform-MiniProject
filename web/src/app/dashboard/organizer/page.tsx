import { OrganizerDashboardView } from "@/features/dashboard/organizer/views/dashboard-view";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/sign-in");
  }
  return (
    <DashboardPageLayout
      title={`Welcome back, ${session.user.name || "Organizer"}`}
      description="Manage your events and view analytics"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Organizer Dashboard", href: "/dashboard/organizer" },
      ]}
    >
      <OrganizerDashboardView />
    </DashboardPageLayout>
  );
}
