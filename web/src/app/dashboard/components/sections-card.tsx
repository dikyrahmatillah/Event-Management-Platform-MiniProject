import {
  FaArrowTrendUp as IconTrendingUp,
  FaCalendarCheck,
  FaTicket,
  FaClock,
  FaStar,
} from "react-icons/fa6";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { chartData } from "@/app/dashboard/data/chart-data";
interface SectionCardsProps {
  timeRange: string;
}

export function SectionCards({ timeRange }: SectionCardsProps) {
  const dateNow = new Date();
  const referenceDate = new Date(
    dateNow.getFullYear(),
    dateNow.getMonth(),
    dateNow.getDate()
  );

  let daysToSubtract = 7;
  if (timeRange === "this-month") {
    daysToSubtract = 30;
  } else if (timeRange === "last-month") {
    referenceDate.setMonth(referenceDate.getMonth() - 1);
    daysToSubtract = 30;
  }

  const startDate = new Date(referenceDate);
  startDate.setDate(startDate.getDate() - daysToSubtract);

  const revenueThisMonth = chartData.reduce((acc, item) => {
    if (new Date(item.date) >= startDate) {
      return acc + item.revenue;
    }
    return acc;
  }, 0);

  const ticketsSoldThisMonth = chartData.reduce((acc, item) => {
    if (new Date(item.date) >= startDate) {
      return acc + item.tickets;
    }
    return acc;
  }, 0);

  return (
    <div className="*:data-[slot=card]:from-primary/4 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Revenue</CardDescription>
            <Badge variant="outline">+12.5%</Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp {revenueThisMonth.toLocaleString("id-ID")}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            From ticket sales across all events
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Events</CardDescription>
            <Badge variant="outline">+3 new</Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <FaCalendarCheck className="size-6 text-primary" />
            12
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            3 upcoming events <FaCalendarCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">9 completed, 3 upcoming</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Tickets Sold</CardDescription>
            <Badge variant="outline">+18.2%</Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <FaTicket className="size-6 text-primary" />
            {ticketsSoldThisMonth}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong ticket sales <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Across all active events</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Pending Actions</CardDescription>
            <Badge variant="destructive">
              <FaClock />
              Urgent
            </Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <FaClock className="size-6 text-amber-500" />8
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Payment confirmations needed <FaClock className="size-4" />
          </div>
          <div className="text-muted-foreground">
            5 awaiting approval, 3 expiring soon
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
