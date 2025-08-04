"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Badge } from "@/components/ui/atomic/badge";
import { Button } from "@/components/ui/atomic/button";

export function MyEvents() {
  // This would typically fetch user's events from your API
  const events = [
    {
      id: "EVT-001",
      title: "Tech Conference 2025",
      date: "2025-08-15",
      time: "09:00",
      location: "Jakarta Convention Center",
      status: "confirmed",
      ticketType: "VIP",
      price: 150000,
    },
    {
      id: "EVT-002",
      title: "Digital Marketing Workshop",
      date: "2025-08-20",
      time: "14:00",
      location: "Online",
      status: "pending_payment",
      ticketType: "Regular",
      price: 75000,
    },
    {
      id: "EVT-003",
      title: "UI/UX Design Bootcamp",
      date: "2025-07-30",
      time: "10:00",
      location: "Bandung Creative Hub",
      status: "attended",
      ticketType: "Premium",
      price: 200000,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending_payment":
        return "bg-yellow-100 text-yellow-800";
      case "attended":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Events</CardTitle>
        <CardDescription>
          Events you&apos;ve registered for and attended
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{event.title}</h3>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      📅 {formatDate(event.date)} at {event.time}
                    </p>
                    <p>📍 {event.location}</p>
                    <p>
                      🎫 {event.ticketType} - {formatCurrency(event.price)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t">
                {event.status === "confirmed" && (
                  <>
                    <Button size="sm" variant="outline">
                      View Ticket
                    </Button>
                    <Button size="sm" variant="outline">
                      Add to Calendar
                    </Button>
                  </>
                )}

                {event.status === "pending_payment" && (
                  <Button size="sm">Complete Payment</Button>
                )}

                {event.status === "attended" && (
                  <Button size="sm" variant="outline">
                    Write Review
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
