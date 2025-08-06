"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {} from "date-fns";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/atomic/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/atomic/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/atomic/toggle-group";
import { chartData } from "@/app/dashboard/organizer/data/chart-data";

export const description = "Event revenue and ticket sales analytics";

const chartConfig = {
  revenue: {
    label: "Total Revenue (IDR)",
    color: "var(--primary)",
  },
  tickets: {
    label: "Attendees",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
  data?: Array<{
    date: string;
    revenue: number;
    tickets: number;
  }>;
  loading?: boolean;
}

export function ChartAreaInteractive({
  timeRange,
  onTimeRangeChange,
  data,
  loading,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isMobile) {
      onTimeRangeChange("this-day");
    }
  }, [isMobile, onTimeRangeChange]);

  // Use real data if available, otherwise fallback to static data
  const chartDataToUse = data || chartData;

  const filteredData = chartDataToUse.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();

    if (timeRange === "this-day") {
      // Only today
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
      );
    } else if (timeRange === "this-month") {
      // This month
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );
    } else if (timeRange === "this-year") {
      // This year
      return date.getFullYear() === now.getFullYear();
    }

    return false;
  });

  const timeRangeLabels: Record<string, string> = {
    "this-day": "Today",
    "this-month": "This Month",
    "this-year": "This Year",
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Revenue & Attendees</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Data for {timeRangeLabels[timeRange]}
          </span>
          <span className="@[540px]/card:hidden">
            {timeRangeLabels[timeRange]}
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={onTimeRangeChange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="this-day">Today</ToggleGroupItem>
            <ToggleGroupItem value="this-month">This Month</ToggleGroupItem>
            <ToggleGroupItem value="this-year">This Year</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Today" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="this-day" className="rounded-lg">
                Today
              </SelectItem>
              <SelectItem value="this-month" className="rounded-lg">
                This Month
              </SelectItem>
              <SelectItem value="this-year" className="rounded-lg">
                This Year
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="aspect-auto h-[250px] w-full flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart data...</div>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={1.0}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-tickets)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-tickets)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="tickets"
                name="Attendees"
                type="natural"
                fill="url(#fillTickets)"
                stroke="var(--color-tickets)"
                stackId="a"
              />
              <Area
                dataKey="revenue"
                name="Total Revenue"
                type="natural"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
