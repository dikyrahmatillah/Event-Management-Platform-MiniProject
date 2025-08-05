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
  Bar,
  BarChart,
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

interface TicketsAnalyticsProps {
  timeRange: string;
}

const ticketSalesData = [
  { month: "Jan", regular: 120, vip: 45, student: 85 },
  { month: "Feb", regular: 145, vip: 52, student: 98 },
  { month: "Mar", regular: 135, vip: 48, student: 92 },
  { month: "Apr", regular: 180, vip: 61, student: 115 },
  { month: "May", regular: 160, vip: 55, student: 105 },
  { month: "Jun", regular: 195, vip: 67, student: 128 },
  { month: "Jul", regular: 210, vip: 72, student: 138 },
];

const chartConfig = {
  regular: {
    label: "Regular",
    color: "hsl(var(--chart-1))",
  },
  vip: {
    label: "VIP",
    color: "hsl(var(--chart-2))",
  },
  student: {
    label: "Student",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function TicketsAnalytics({ timeRange }: TicketsAnalyticsProps) {
  const filteredData = React.useMemo(() => {
    return ticketSalesData;
  }, []);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Regular Tickets</CardDescription>
            <CardTitle className="text-2xl">1,245</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">60% of total sales</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>VIP Tickets</CardDescription>
            <CardTitle className="text-2xl">400</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="default">19% of total sales</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Student Tickets</CardDescription>
            <CardTitle className="text-2xl">761</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant="outline">31% of total sales</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ticket Sales Breakdown</CardTitle>
          <CardDescription>Monthly ticket sales by category</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
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
                <Bar
                  dataKey="regular"
                  stackId="a"
                  fill="var(--color-regular)"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="vip"
                  stackId="a"
                  fill="var(--color-vip)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="student"
                  stackId="a"
                  fill="var(--color-student)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
