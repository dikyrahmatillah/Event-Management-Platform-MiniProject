import { ComingSoon } from "@/features/dashboard/components/coming-soon";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

export default function RewardsPointsPage() {
  return (
    <DashboardPageLayout
      title="My Rewards Points"
      description="View and manage your rewards points, including earning and redemption history."
      breadcrumbs={[
        { label: "Customer Dashboard", href: "/dashboard/customer" },
        { label: "My Rewards Points", isActive: true },
      ]}
    >
      <ComingSoon text="Rewards points features coming soon..." />
    </DashboardPageLayout>
  );
}
