"use client";

import { ComingSoon } from "@/features/dashboard/components/coming-soon";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

export default function EventHistoryPage() {
  return (
    <DashboardPageLayout
      title="Event History"
      description="View your past event attendance and experiences."
      breadcrumbs={[
        { label: "Customer Dashboard", href: "/dashboard/customer" },
        { label: "Event History", isActive: true },
      ]}
    >
      <ComingSoon text="Event history features coming soon..." />
    </DashboardPageLayout>
  );
}
