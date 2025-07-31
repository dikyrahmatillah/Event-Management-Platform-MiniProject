"use client";

import { useState } from "react";
import { ChartAreaInteractive } from "./chart-area-interactive";
import { SectionCards } from "./sections-card";

export function DashboardAnalytics() {
  const [timeRange, setTimeRange] = useState("last-7-days");

  return (
    <>
      <SectionCards timeRange={timeRange} />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      </div>
    </>
  );
}
