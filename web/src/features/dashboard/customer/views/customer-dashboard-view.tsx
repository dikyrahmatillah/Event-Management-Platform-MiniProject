"use client";

import { PointsCard } from "../components/points-card";
import { CouponsCard } from "../components/coupons-card";
import { UpcomingEvents } from "@/features/dashboard/shared/upcoming-events";

export function CustomerDashboardView() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <PointsCard />
        </div>
        <div className="xl:col-span-2">
          <CouponsCard />
        </div>
      </div>
      <div className="px-4 lg:px-6">
        <UpcomingEvents />
      </div>
    </>
  );
}
