"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Badge } from "@/components/ui/atomic/badge";
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/atomic/chart";

interface EventsAnalyticsProps {
  timeRange: string;
}

const eventsData = [
  { month: "Jan", created: 3, completed: 2, cancelled: 1 },
  { month: "Feb", created: 5, completed: 4, cancelled: 0 },
  { month: "Mar", created: 7, completed: 6, cancelled: 1 },
  { month: "Apr", created: 8, completed: 7, cancelled: 0 },
  { month: "May", created: 10, completed: 9, cancelled: 1 },
  { month: "Jun", created: 6, completed: 5, cancelled: 1 },
  { month: "Jul", created: 12, completed: 10, cancelled: 0 },
];

const chartConfig = {
  created: {
    label: "Created",
    color: "var(--primary)",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
  cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function EventsAnalytics({ timeRange }: EventsAnalyticsProps) {
  const filteredData = React.useMemo(() => {
    return eventsData;
  }, []);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Events Created</CardDescription>
            <CardTitle className="text-2xl">51</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">+18% from last month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Events Completed</CardDescription>
            <CardTitle className="text-2xl">43</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default">84% completion rate</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Events Cancelled</CardDescription>
            <CardTitle className="text-2xl">4</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">8% cancellation rate</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Events Trends</CardTitle>
          <CardDescription>
            Monthly events creation and completion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredData}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="var(--color-created)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="var(--color-completed)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="cancelled"
                  stroke="var(--color-cancelled)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
