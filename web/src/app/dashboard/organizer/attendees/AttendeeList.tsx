"use client";
import { useEffect, useState } from "react";
import { Attendee } from "@/types/attendee.types";
import { AttendeeTable } from "@/features/dashboard/attendees/pages/attendee-table.page";
import { fetchAttendeesByEventId } from "@/lib/api/attendee-service";
import { eventService } from "@/lib/api/event-service";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function AttendeeList() {
  const { data: session, status } = useSession();

  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (status !== "authenticated" || !session?.user?.id) return;
      setLoading(true);
      try {
        const events = await eventService.getAllEventsByOrganizer(
          Number(session.user.id)
        );
        let allAttendees: Attendee[] = [];
        for (const event of events) {
          try {
            const eventAttendees = await fetchAttendeesByEventId(event.id);
            console.log(`Attendees for event ${event.id}:`, eventAttendees);
            if (Array.isArray(eventAttendees)) {
              allAttendees = allAttendees.concat(eventAttendees);
            }
          } catch (err) {
            toast.error(`Failed to fetch attendees for event ${event.id}`);
          }
        }
        setAttendees(allAttendees);
      } catch {
        toast.error("Failed to fetch attendees");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [session, status]);

  if (loading) return <div>Loading attendees...</div>;

  return <AttendeeTable attendees={attendees} />;
}
