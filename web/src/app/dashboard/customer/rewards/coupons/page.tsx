import { ComingSoon } from "@/features/dashboard/components/coming-soon";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

export default function RewardsCouponsPage() {
  return (
    <DashboardPageLayout
      title="My Rewards Coupons"
      description="View and manage your rewards coupons, including details and redemption options."
      breadcrumbs={[
        { label: "Customer Dashboard", href: "/dashboard/customer" },
        { label: "My Rewards Coupons", isActive: true },
      ]}
    >
      <ComingSoon text="Rewards coupons features coming soon..." />
    </DashboardPageLayout>
  );
}
