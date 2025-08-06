"use client";

import { useState } from "react";
import { ChartAreaInteractive } from "../../components/chart-area-interactive";
import { SectionCards } from "../../components/sections-card";

export function AnalyticsCard() {
  const [timeRange, setTimeRange] = useState("this-day");

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
