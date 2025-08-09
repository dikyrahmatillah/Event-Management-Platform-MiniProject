"use client";

import React from "react";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { useSession } from "next-auth/react";
import { ComingSoon } from "@/features/dashboard/components/coming-soon";

export default function BrowseEventsPage() {
  const { data: session } = useSession();
  return (
    <DashboardPageLayout
      title={`Welcome back, ${session?.user?.name || "Customer"}`}
      description="Here's your event overview and activity summary."
      breadcrumbs={[
        { label: "Customer Dashboard", href: "/dashboard/customer" },
        { label: "Browse Events", isActive: true },
      ]}
    >
      <ComingSoon text="Event browsing features coming soon..." />
    </DashboardPageLayout>
  );
}
