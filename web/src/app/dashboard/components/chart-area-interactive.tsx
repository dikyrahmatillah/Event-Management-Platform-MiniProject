"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  subDays,
  isWithinInterval,
} from "date-fns";

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
import { chartData } from "@/app/dashboard/data/chart-data";

export const description = "Event revenue and ticket sales analytics";

const chartConfig = {
  analytics: {
    label: "Event Analytics",
  },
  revenue: {
    label: "Revenue (IDR)",
    color: "var(--primary)",
  },
  tickets: {
    label: "Tickets Sold",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  timeRange: string;
  onTimeRangeChange: (value: string) => void;
}

export function ChartAreaInteractive({
  timeRange,
  onTimeRangeChange,
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (isMobile) {
      onTimeRangeChange("last-7-days");
    }
  }, [isMobile, onTimeRangeChange]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();

    if (timeRange === "last-7-days") {
      const sevenDaysAgo = subDays(now, 7);
      return isWithinInterval(date, { start: sevenDaysAgo, end: now });
    } else if (timeRange === "this-month") {
      const thisMonthStart = startOfMonth(now);
      const thisMonthEnd = endOfMonth(now);
      return isWithinInterval(date, {
        start: thisMonthStart,
        end: thisMonthEnd,
      });
    } else if (timeRange === "last-month") {
      const lastMonthDate = subMonths(now, 1);
      const lastMonthStart = startOfMonth(lastMonthDate);
      const lastMonthEnd = endOfMonth(lastMonthDate);
      return isWithinInterval(date, {
        start: lastMonthStart,
        end: lastMonthEnd,
      });
    }

    return false;
  });

  const timeRangeLabels: Record<string, string> = {
    "last-7-days": "Last 7 Days",
    "this-month": "This Month",
    "last-month": "Last Month",
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Revenue & Ticket Sales Analytics</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Event performance for {timeRangeLabels[timeRange]}
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
            <ToggleGroupItem value="last-7-days">Last 7 Days</ToggleGroupItem>
            <ToggleGroupItem value="this-month">This Month</ToggleGroupItem>
            <ToggleGroupItem value="last-month">Last Month</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 7 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="last-7-days" className="rounded-lg">
                Last 7 days
              </SelectItem>
              <SelectItem value="this-month" className="rounded-lg">
                This Month
              </SelectItem>
              <SelectItem value="last-month" className="rounded-lg">
                Last Month
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
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
              type="natural"
              fill="url(#fillTickets)"
              stroke="var(--color-tickets)"
              stackId="a"
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
