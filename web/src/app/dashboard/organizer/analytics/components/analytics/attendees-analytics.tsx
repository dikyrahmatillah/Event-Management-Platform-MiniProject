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
  Area,
  AreaChart,
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

interface AttendeesAnalyticsProps {
  timeRange: string;
}

const attendeesData = [
  { month: "Jan", registrations: 450, attendance: 380 },
  { month: "Feb", registrations: 520, attendance: 445 },
  { month: "Mar", registrations: 480, attendance: 420 },
  { month: "Apr", registrations: 610, attendance: 580 },
  { month: "May", registrations: 550, attendance: 495 },
  { month: "Jun", registrations: 670, attendance: 625 },
  { month: "Jul", registrations: 720, attendance: 680 },
];

const chartConfig = {
  registrations: {
    label: "Registrations",
    color: "hsl(var(--chart-1))",
  },
  attendance: {
    label: "Attendance",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AttendeesAnalytics({ timeRange }: AttendeesAnalyticsProps) {
  const filteredData = React.useMemo(() => {
    return attendeesData;
  }, []);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Registrations</CardDescription>
            <CardTitle className="text-2xl">4,145</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">+22% from last month</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Attendance</CardDescription>
            <CardTitle className="text-2xl">3,625</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default">87.5% attendance rate</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>No-Shows</CardDescription>
            <CardTitle className="text-2xl">520</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline">12.5% no-show rate</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Attendee Analytics</CardTitle>
          <CardDescription>
            Registration vs attendance comparison
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
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
                <Area
                  type="monotone"
                  dataKey="registrations"
                  stackId="1"
                  stroke="var(--color-registrations)"
                  fill="var(--color-registrations)"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stackId="1"
                  stroke="var(--color-attendance)"
                  fill="var(--color-attendance)"
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
