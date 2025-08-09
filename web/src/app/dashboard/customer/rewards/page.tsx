import { ComingSoon } from "@/features/dashboard/components/coming-soon";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

export default function CustomerRewardsPage() {
  return (
    <DashboardPageLayout
      title="Customer Rewards"
      description="Explore your rewards and benefits as a valued customer."
      breadcrumbs={[
        { label: "Customer Dashboard", href: "/dashboard/customer" },
        { label: "Customer Rewards", isActive: true },
      ]}
    >
      <ComingSoon text="Rewards features coming soon..." />
    </DashboardPageLayout>
  );
}
