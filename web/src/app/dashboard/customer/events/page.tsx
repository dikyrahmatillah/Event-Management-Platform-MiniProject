"use client";

import { ComingSoon } from "@/features/dashboard/components/coming-soon";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";

export default function CustomerEventsPage() {
  return (
    <DashboardPageLayout
      title="My Events"
      description="View and manage your registered events, including details and attendance."
      breadcrumbs={[
        { label: "Customer Dashboard", href: "/dashboard/customer" },
        { label: "My Events", isActive: true },
      ]}
    >
      <ComingSoon text="Event management features coming soon..." />
    </DashboardPageLayout>
  );
}
