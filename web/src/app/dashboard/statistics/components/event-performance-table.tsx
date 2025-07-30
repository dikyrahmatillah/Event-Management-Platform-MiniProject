import { FaCalendarDays, FaEye, FaFilter } from "react-icons/fa6";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timeRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 3 months" },
  { value: "1y", label: "Last year" },
];

const eventStats = [
  {
    id: "EVT-001",
    title: "Tech Innovation Summit 2024",
    date: "2024-08-15",
    totalTickets: 500,
    ticketsSold: 456,
    revenue: 22800000,
    attendanceRate: 91.2,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: "EVT-002",
    title: "Digital Marketing Workshop",
    date: "2024-08-22",
    totalTickets: 150,
    ticketsSold: 89,
    revenue: 4450000,
    attendanceRate: 59.3,
    rating: 4.3,
    reviews: 23,
  },
  {
    id: "EVT-003",
    title: "Startup Pitch Competition",
    date: "2024-09-05",
    totalTickets: 300,
    ticketsSold: 234,
    revenue: 11700000,
    attendanceRate: 78.0,
    rating: 4.6,
    reviews: 45,
  },
];

export function EventPerformanceTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Event Performance Analysis</CardTitle>
            <CardDescription>
              Detailed statistics for your events
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Select defaultValue="90d">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <FaFilter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {eventStats.map((event) => (
            <div key={event.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <FaCalendarDays className="h-4 w-4" />
                    <span>
                      {new Date(event.date).toLocaleDateString("id-ID")}
                    </span>
                    <Badge variant="outline">
                      {event.ticketsSold}/{event.totalTickets} sold
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <FaEye className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    Rp {(event.revenue / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {event.attendanceRate}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Attendance
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {event.rating}/5
                  </div>
                  <div className="text-xs text-muted-foreground">Rating</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {event.reviews}
                  </div>
                  <div className="text-xs text-muted-foreground">Reviews</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
