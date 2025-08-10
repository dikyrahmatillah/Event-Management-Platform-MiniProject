import { ComingSoon } from "@/features/dashboard/components/coming-soon";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
export default function CreatePromotionPage() {
  return (
    <DashboardPageLayout
      title="Create Promotion"
      description="Create and manage your promotions"
      breadcrumbs={[
        { label: "Organizer Dashboard", href: "/dashboard/organizer" },
        { label: "Promotions", href: "/dashboard/organizer/promotions" },
        {
          label: "Create Promotion",
          href: "/dashboard/organizer/promotions/create",
        },
      ]}
    >
      <ComingSoon text="Promotion creation features are coming soon! Stay tuned for updates." />
    </DashboardPageLayout>
  );
}
