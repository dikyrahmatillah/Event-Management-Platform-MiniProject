"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ChartAreaInteractive } from "../../components/chart-area-interactive";
import { SectionCards } from "../../components/sections-card";
import { useAnalytics } from "@/hooks/use-analytics";

export function AnalyticsCard() {
  const [timeRange, setTimeRange] = useState("this-day");
  const { data: session } = useSession();
  const organizerId = session?.user?.id ? Number(session.user.id) : undefined;
  const { data, loading, error } = useAnalytics(timeRange, organizerId);

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <div className="text-red-500 text-center py-4">
          Error loading analytics: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <SectionCards data={data} loading={loading} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          organizerId={organizerId}
        />
      </div>
    </>
  );
}
