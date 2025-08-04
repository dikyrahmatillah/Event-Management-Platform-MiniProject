"use client";

import { AnalyticsCard } from "../components/analytics-card";
import { EventReviews } from "../components/event-reviews";
import { RecentTransactions } from "../components/recent-transactions";
import { UpcomingEvents } from "../../shared/upcoming-events";

export function OrganizerDashboardView() {
  return (
    <>
      <AnalyticsCard />
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 xl:grid-cols-4">
        <div className="xl:col-span-2">
          <RecentTransactions />
        </div>
        <div className="xl:col-span-2">
          <UpcomingEvents />
        </div>
      </div>
      <div className="px-4 lg:px-6">
        <EventReviews />
      </div>
    </>
  );
}
