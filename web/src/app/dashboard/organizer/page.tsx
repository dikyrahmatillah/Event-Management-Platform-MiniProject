import { OrganizerDashboardView } from "@/features/dashboard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const breadcrumbs = [
    { label: "Organizer Dashboard", href: "/dashboard/organizer" },
    { label: "Overview", isActive: true },
  ];

  return (
    <DashboardPageLayout
      title={`Welcome back, ${session.user.name || "Organizer"}`}
      description="Manage your events and view analytics"
      breadcrumbs={breadcrumbs}
    >
      <OrganizerDashboardView />
    </DashboardPageLayout>
  );
}
