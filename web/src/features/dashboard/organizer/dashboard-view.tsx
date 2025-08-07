"use client";

import { AnalyticsCard } from "./components/analytics-card";
import { EventReviews } from "./components/event-reviews";

export function OrganizerDashboardView() {
  return (
    <>
      <AnalyticsCard />

      <div className="px-4 lg:px-6">
        <EventReviews />
      </div>
    </>
  );
}
