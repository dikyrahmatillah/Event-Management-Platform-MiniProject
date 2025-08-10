import { ComingSoon } from "@/features/dashboard/components/coming-soon";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

export default function RevenuePage() {
  return (
    <DashboardPageLayout
      title="Revenue"
      description="View and manage your event revenue"
      breadcrumbs={[
        { label: "Organizer Dashboard", href: "/dashboard/organizer" },
        { label: "Revenue", href: "/dashboard/organizer/revenue" },
      ]}
    >
      <ComingSoon text="Revenue features are coming soon! Stay tuned for updates." />
    </DashboardPageLayout>
  );
}
