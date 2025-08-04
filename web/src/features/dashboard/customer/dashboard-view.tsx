"use client";

import { PointsCard } from "./components/points-card";
import { CouponsCard } from "./components/coupons-card";
import { PaymentHistory } from "./components/payment-history";
import { MyEvents } from "./components/my-events";

export function CustomerDashboardView() {
  return (
    <>
      {/* Top row - Points and Coupons */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <PointsCard />
        </div>
        <div className="xl:col-span-2">
          <CouponsCard />
        </div>
      </div>

      {/* Bottom row - My Events and Payment History */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-2">
        <div>
          <MyEvents />
        </div>
        <div>
          <PaymentHistory />
        </div>
      </div>
    </>
  );
}
