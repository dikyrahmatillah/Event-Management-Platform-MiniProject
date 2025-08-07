import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";

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
  data?: AnalyticsData | null;
  loading?: boolean;
}

export function SectionCards({ data, loading }: SectionCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardDescription className="text-2xl font-bold">--</CardDescription>
          </Card>
        ))}
      </div>
    );
  }

  const revenue = data?.totalRevenue || 0;
  const attendees = data?.totalAttendees || 0;

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
              attendees
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
