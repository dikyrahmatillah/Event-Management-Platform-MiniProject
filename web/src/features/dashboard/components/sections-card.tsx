import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";

import { chartData } from "@/app/dashboard/organizer/data/chart-data";

interface AnalyticsData {
  totalRevenue: number;
  totalAttendees: number;
  dailyData: Array<{
    date: string;
    revenue: number;
    tickets: number;
  }>;
}

interface SectionCardsProps {
  timeRange: string;
  data?: AnalyticsData | null;
  loading?: boolean;
}

export function SectionCards({ timeRange, data, loading }: SectionCardsProps) {
  const dateNow = new Date();

  let revenue = 0;
  let ticketsSold = 0;

  // Use real data if available, otherwise fallback to static data
  if (data) {
    revenue = data.totalRevenue;
    ticketsSold = data.totalAttendees;
  } else {
    // Fallback to static data processing
    chartData.forEach((item) => {
      const date = new Date(item.date);
      if (timeRange === "this-day") {
        if (
          date.getFullYear() === dateNow.getFullYear() &&
          date.getMonth() === dateNow.getMonth() &&
          date.getDate() === dateNow.getDate()
        ) {
          revenue += item.revenue;
          ticketsSold += item.tickets;
        }
      } else if (timeRange === "this-month") {
        if (
          date.getFullYear() === dateNow.getFullYear() &&
          date.getMonth() === dateNow.getMonth()
        ) {
          revenue += item.revenue;
          ticketsSold += item.tickets;
        }
      } else if (timeRange === "this-year") {
        if (date.getFullYear() === dateNow.getFullYear()) {
          revenue += item.revenue;
          ticketsSold += item.tickets;
        }
      }
    });
  }

  return (
    <div className="*:data-[slot=card]:from-primary/4 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Revenue</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {loading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              `Rp ${revenue.toLocaleString("id-ID")}`
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            From ticket sales across all events
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Attendees</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            {loading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              ticketsSold
            )}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">Across all active events</div>
        </CardFooter>
      </Card>
    </div>
  );
}
