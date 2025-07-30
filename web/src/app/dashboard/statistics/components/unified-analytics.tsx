"use client";

import { useState, lazy, Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Users, Ticket, TrendingUp, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RevenueAnalytics = lazy(() =>
  import("./analytics/revenue-analytics").then((module) => ({
    default: module.RevenueAnalytics,
  }))
);
const EventsAnalytics = lazy(() =>
  import("./analytics/events-analytics").then((module) => ({
    default: module.EventsAnalytics,
  }))
);
const AttendeesAnalytics = lazy(() =>
  import("./analytics/attendees-analytics").then((module) => ({
    default: module.AttendeesAnalytics,
  }))
);
const TicketsAnalytics = lazy(() =>
  import("./analytics/tickets-analytics").then((module) => ({
    default: module.TicketsAnalytics,
  }))
);

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="h-8 w-8 animate-spin" />
    <span className="ml-2 text-sm text-muted-foreground">
      Loading analytics...
    </span>
  </div>
);

export function UnifiedAnalytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("revenue");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>
              Comprehensive insights into your event management performance
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="revenue" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Revenue
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="attendees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Attendees
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              Tickets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="space-y-4">
            <Suspense fallback={<LoadingSpinner />}>
              <RevenueAnalytics timeRange={timeRange} />
            </Suspense>
          </TabsContent>

          <TabsContent value="events" className="space-y-4">
            <Suspense fallback={<LoadingSpinner />}>
              <EventsAnalytics timeRange={timeRange} />
            </Suspense>
          </TabsContent>

          <TabsContent value="attendees" className="space-y-4">
            <Suspense fallback={<LoadingSpinner />}>
              <AttendeesAnalytics timeRange={timeRange} />
            </Suspense>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-4">
            <Suspense fallback={<LoadingSpinner />}>
              <TicketsAnalytics timeRange={timeRange} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
