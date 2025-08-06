"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AttendeeTable } from "@/features/dashboard/attendees/pages/attendee-table.page";
import { attendeeService } from "@/lib/api/attendee-service";
import { Attendee } from "@/types/attendee.types";
import { DashboardPageLayout } from "@/features/dashboard/components/dashboard-page-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/atomic/card";
import { Button } from "@/components/ui/atomic/button";
import { ArrowLeftIcon, UserIcon, DownloadIcon } from "lucide-react";
import EventService from "@/lib/api/event-service";
import { useSession } from "next-auth/react";

export default function EventAttendeesPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.id);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState("");

  const { data: session } = useSession();

  useEffect(() => {
    async function loadData() {
      if (!eventId) return;

      setLoading(true);
      try {
        const eventService = new EventService();
        // Fetch event details to get the name
        const eventData = await eventService.getEventById(eventId);
        if (eventData) {
          setEventName(eventData.eventName);
        }

        // Fetch attendees using the service
        const token = session?.user?.accessToken;
        const attendeeData = await attendeeService.getAttendeesByEventId(
          eventId,
          token
        );
        setAttendees(attendeeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [eventId, session]);

  const breadcrumbs = [
    { label: "Organizer Dashboard", href: "/dashboard/organizer" },
    { label: "Events", href: "/dashboard/organizer/events" },
    {
      label: eventName || `Event #${eventId}`,
      href: `/dashboard/organizer/events/${eventId}`,
    },
    { label: "Attendees", isActive: true },
  ];

  return (
    <DashboardPageLayout
      title={`Attendees for ${eventName || `Event #${eventId}`}`}
      description="Manage and track all registered attendees for this event"
      breadcrumbs={breadcrumbs}
    >
      <div className="px-4 lg:px-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to Event
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <DownloadIcon className="h-4 w-4" /> Export List
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              <span>Attendee List</span>
              <div className="ml-2 bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full">
                {attendees.length}{" "}
                {attendees.length === 1 ? "attendee" : "attendees"}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4 py-8">
                <div className="h-12 animate-pulse bg-muted rounded"></div>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 animate-pulse bg-muted/50 rounded"
                  ></div>
                ))}
              </div>
            ) : (
              <AttendeeTable attendees={attendees} />
            )}

            {!loading && attendees.length === 0 && (
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="text-sm"
                >
                  Refresh List
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
