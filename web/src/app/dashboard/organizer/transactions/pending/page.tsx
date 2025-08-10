import { ComingSoon } from "@/features/dashboard/components/coming-soon";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

export default function PendeingTransactionsPage() {
  return (
    <DashboardPageLayout
      title="Pending Transactions"
      description="View and manage your pending transactions"
      breadcrumbs={[
        { label: "Organizer Dashboard", href: "/dashboard/organizer" },
        {
          label: "Pending Transactions",
          href: "/dashboard/organizer/transactions/pending",
        },
      ]}
    >
      <ComingSoon text="Pending transactions features are coming soon! Stay tuned for updates." />
    </DashboardPageLayout>
  );
}
