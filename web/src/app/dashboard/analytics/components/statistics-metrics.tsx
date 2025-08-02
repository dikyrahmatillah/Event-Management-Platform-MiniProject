import {
  FaArrowTrendUp as IconTrendingUp,
  FaCalendarCheck,
  FaTicket,
  FaUsers,
  FaStar,
  FaChartLine,
} from "react-icons/fa6";

import { Badge } from "@/components/ui/atomic/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";

export function StatisticsMetrics() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-3 @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Revenue</CardDescription>
            <Badge variant="outline">+24.3%</Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Rp 122.1M
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Revenue growth <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Year-to-date performance</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Events Hosted</CardDescription>
            <Badge variant="outline">+15 new</Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <FaCalendarCheck className="size-6 text-primary" />
            87
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Total events this year <FaCalendarCheck className="size-4" />
          </div>
          <div className="text-muted-foreground">65 completed, 22 upcoming</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Tickets Sold</CardDescription>
            <Badge variant="outline">+28.7%</Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <FaTicket className="size-6 text-primary" />
            12,846
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong ticket sales <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Across all events</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Total Attendees</CardDescription>
            <Badge variant="outline">+31.2%</Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <FaUsers className="size-6 text-primary" />
            11,234
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            High attendance rate <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">87.4% attendance rate</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Avg. Rating</CardDescription>
            <Badge variant="outline">+0.3</Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <FaStar className="size-6 text-yellow-400" />
            4.7
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Excellent satisfaction <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Based on 1,247 reviews</div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription>Conversion Rate</CardDescription>
            <Badge variant="outline">+5.1%</Badge>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl flex items-center gap-2">
            <FaChartLine className="size-6 text-green-500" />
            84.2%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            High conversion rate <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Views to ticket sales</div>
        </CardFooter>
      </Card>
    </div>
  );
}
