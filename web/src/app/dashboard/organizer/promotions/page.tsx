import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { ComingSoon } from "@/features/dashboard/components/coming-soon";
export default function PromotionsPage() {
  return (
    <DashboardPageLayout
      title="Promotions"
      description="Manage your event promotions"
      breadcrumbs={[
        { label: "Organizer Dashboard", href: "/dashboard/organizer" },
        { label: "Promotions", href: "/dashboard/organizer/promotions" },
      ]}
    >
      <ComingSoon text="Promotion management features are coming soon! Stay tuned for updates." />
    </DashboardPageLayout>
  );
}
