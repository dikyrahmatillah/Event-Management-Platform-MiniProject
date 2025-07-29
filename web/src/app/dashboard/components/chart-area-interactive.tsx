"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const description = "Event revenue and ticket sales analytics";

const chartData = [
  { date: "2024-04-01", revenue: 2220000, tickets: 150 },
  { date: "2024-04-02", revenue: 970000, tickets: 80 },
  { date: "2024-04-03", revenue: 1670000, tickets: 120 },
  { date: "2024-04-04", revenue: 2420000, tickets: 160 },
  { date: "2024-04-05", revenue: 3730000, tickets: 190 },
  { date: "2024-04-06", revenue: 3010000, tickets: 140 },
  { date: "2024-04-07", revenue: 2450000, tickets: 180 },
  { date: "2024-04-08", revenue: 4090000, tickets: 220 },
  { date: "2024-04-09", revenue: 590000, tickets: 60 },
  { date: "2024-04-10", revenue: 2610000, tickets: 190 },
  { date: "2024-04-11", revenue: 3270000, tickets: 250 },
  { date: "2024-04-12", revenue: 2920000, tickets: 210 },
  { date: "2024-04-13", revenue: 3420000, tickets: 280 },
  { date: "2024-04-14", revenue: 1370000, tickets: 120 },
  { date: "2024-04-15", revenue: 1200000, tickets: 100 },
  { date: "2024-04-16", revenue: 1380000, tickets: 90 },
  { date: "2024-04-17", revenue: 4460000, tickets: 360 },
  { date: "2024-04-18", revenue: 3640000, tickets: 310 },
  { date: "2024-04-19", revenue: 2430000, tickets: 180 },
  { date: "2024-04-20", revenue: 890000, tickets: 50 },
  { date: "2024-04-21", revenue: 1370000, tickets: 100 },
  { date: "2024-04-22", revenue: 2240000, tickets: 170 },
  { date: "2024-04-23", revenue: 1380000, tickets: 130 },
  { date: "2024-04-24", revenue: 3870000, tickets: 290 },
  { date: "2024-04-25", revenue: 2150000, tickets: 150 },
  { date: "2024-04-26", revenue: 750000, tickets: 80 },
  { date: "2024-04-27", revenue: 3830000, tickets: 320 },
  { date: "2024-04-28", revenue: 1220000, tickets: 80 },
  { date: "2024-04-29", revenue: 3150000, tickets: 240 },
  { date: "2024-04-30", revenue: 4540000, tickets: 380 },
  { date: "2024-05-01", revenue: 1650000, tickets: 120 },
  { date: "2024-05-02", revenue: 2930000, tickets: 210 },
  { date: "2024-05-03", revenue: 2470000, tickets: 190 },
  { date: "2024-05-04", revenue: 3850000, tickets: 320 },
  { date: "2024-05-05", revenue: 4810000, tickets: 390 },
  { date: "2024-05-06", revenue: 4980000, tickets: 420 },
  { date: "2024-05-07", revenue: 3880000, tickets: 300 },
  { date: "2024-05-08", revenue: 1490000, tickets: 110 },
  { date: "2024-05-09", revenue: 2270000, tickets: 180 },
  { date: "2024-05-10", revenue: 2930000, tickets: 230 },
  { date: "2024-05-11", revenue: 3350000, tickets: 270 },
  { date: "2024-05-12", revenue: 1970000, tickets: 140 },
  { date: "2024-05-13", revenue: 1970000, tickets: 160 },
  { date: "2024-05-14", revenue: 4480000, tickets: 390 },
  { date: "2024-05-15", revenue: 4730000, tickets: 380 },
  { date: "2024-05-16", revenue: 3380000, tickets: 300 },
  { date: "2024-05-17", revenue: 4990000, tickets: 420 },
  { date: "2024-05-18", revenue: 3150000, tickets: 250 },
  { date: "2024-05-19", revenue: 2350000, tickets: 180 },
  { date: "2024-05-20", revenue: 1770000, tickets: 130 },
  { date: "2024-05-21", revenue: 820000, tickets: 40 },
  { date: "2024-05-22", revenue: 810000, tickets: 60 },
  { date: "2024-05-23", revenue: 2520000, tickets: 190 },
  { date: "2024-05-24", revenue: 2940000, tickets: 220 },
  { date: "2024-05-25", revenue: 2010000, tickets: 150 },
  { date: "2024-05-26", revenue: 2130000, tickets: 170 },
  { date: "2024-05-27", revenue: 4200000, tickets: 360 },
  { date: "2024-05-28", revenue: 2330000, tickets: 190 },
  { date: "2024-05-29", revenue: 780000, tickets: 80 },
  { date: "2024-05-30", revenue: 3400000, tickets: 280 },
  { date: "2024-05-31", revenue: 1780000, tickets: 130 },
  { date: "2024-06-01", revenue: 1780000, tickets: 100 },
  { date: "2024-06-02", revenue: 4700000, tickets: 310 },
  { date: "2024-06-03", revenue: 1030000, tickets: 60 },
  { date: "2024-06-04", revenue: 4390000, tickets: 280 },
  { date: "2024-06-05", revenue: 880000, tickets: 40 },
  { date: "2024-06-06", revenue: 2940000, tickets: 150 },
  { date: "2024-06-07", revenue: 3230000, tickets: 270 },
  { date: "2024-06-08", revenue: 3850000, tickets: 220 },
  { date: "2024-06-09", revenue: 4380000, tickets: 380 },
  { date: "2024-06-10", revenue: 1550000, tickets: 100 },
  { date: "2024-06-11", revenue: 920000, tickets: 50 },
  { date: "2024-06-12", revenue: 4920000, tickets: 320 },
  { date: "2024-06-13", revenue: 810000, tickets: 80 },
  { date: "2024-06-14", revenue: 4260000, tickets: 280 },
  { date: "2024-06-15", revenue: 3070000, tickets: 250 },
  { date: "2024-06-16", revenue: 3710000, tickets: 210 },
  { date: "2024-06-17", revenue: 4750000, tickets: 420 },
  { date: "2024-06-18", revenue: 1070000, tickets: 70 },
  { date: "2024-06-19", revenue: 3410000, tickets: 190 },
  { date: "2024-06-20", revenue: 4080000, tickets: 350 },
  { date: "2024-06-21", revenue: 1690000, tickets: 110 },
  { date: "2024-06-22", revenue: 3170000, tickets: 170 },
  { date: "2024-06-23", revenue: 4800000, tickets: 430 },
  { date: "2024-06-24", revenue: 1320000, tickets: 80 },
  { date: "2024-06-25", revenue: 1410000, tickets: 90 },
  { date: "2024-06-26", revenue: 4340000, tickets: 280 },
  { date: "2024-06-27", revenue: 4480000, tickets: 390 },
  { date: "2024-06-28", revenue: 1490000, tickets: 100 },
  { date: "2024-06-29", revenue: 1030000, tickets: 60 },
  { date: "2024-06-30", revenue: 4460000, tickets: 300 },
];

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

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Revenue & Ticket Sales Analytics</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Event performance for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
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
