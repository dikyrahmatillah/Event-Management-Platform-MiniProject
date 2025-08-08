"use client";

import React from "react";

import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import { useSession } from "next-auth/react";
import { PointsCard } from "@/features/dashboard/customer/components/points-card";
import { CouponsCard } from "@/features/dashboard/customer/components/coupons-card";

export default function CustomerDashboardPage() {
  const breadcrumbs = [
    { label: "Customer Dashboard", href: "/dashboard/customer" },
    { label: "Overview", isActive: true },
  ];
  const { data: session } = useSession();

  return (
    <DashboardPageLayout
      title={`Welcome back, ${session?.user?.name || "Customer"}`}
      description="Here's your event overview and activity summary."
      breadcrumbs={breadcrumbs}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 lg:px-6">
        <PointsCard />
        <CouponsCard />
      </div>
    </DashboardPageLayout>
  );
}
