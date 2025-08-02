import {
  FaCalendarDays,
  FaLocationDot,
  FaTicket,
  FaUsers,
} from "react-icons/fa6";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Badge } from "@/components/ui/atomic/badge";

const upcomingEvents = [
  {
    id: "EVT-001",
    title: "Tech Innovation Summit 2024",
    date: "2024-08-15",
    time: "09:00",
    location: "Jakarta Convention Center",
    ticketsSold: 456,
    totalTickets: 500,
    revenue: "Rp 22,800,000",
    status: "active",
  },
  {
    id: "EVT-002",
    title: "Digital Marketing Workshop",
    date: "2024-08-22",
    time: "13:00",
    location: "Bali International Center",
    ticketsSold: 89,
    totalTickets: 150,
    revenue: "Rp 4,450,000",
    status: "active",
  },
  {
    id: "EVT-003",
    title: "Startup Pitch Competition",
    date: "2024-09-05",
    time: "10:00",
    location: "Surabaya Business District",
    ticketsSold: 234,
    totalTickets: 300,
    revenue: "Rp 11,700,000",
    status: "active",
  },
];

export function UpcomingEvents() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>
          Your scheduled events and their performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start justify-between space-x-4 rounded-lg border p-4"
            >
              <div className="flex-1 space-y-3">
                <div>
                  <h4 className="text-sm font-medium leading-none">
                    {event.title}
                  </h4>
                  <div className="mt-2 flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <FaCalendarDays className="h-3 w-3" />
                      <span>
                        {new Date(event.date).toLocaleDateString("id-ID")} at{" "}
                        {event.time}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FaLocationDot className="h-3 w-3" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    <FaTicket className="h-3 w-3 text-primary" />
                    <span>
                      {event.ticketsSold}/{event.totalTickets} sold
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FaUsers className="h-3 w-3 text-primary" />
                    <span>{event.ticketsSold} attendees</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col  items-end ">
                <p className="text-sm font-medium">{event.revenue}</p>
                <Badge
                  variant="default"
                  className="bg-green-500 hover:bg-green-600 mb-1"
                >
                  Active
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
