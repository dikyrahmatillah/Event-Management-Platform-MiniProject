"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AttendeeTable } from "@/features/dashboard/attendees/pages/attendee-table.page";
import { fetchAttendeesByEventId } from "@/lib/api/attendee-service";
import { Attendee } from "@/types/attendee.types";

export default function EventAttendeesPage() {
  const params = useParams();
  const eventId = Number(params.id);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetchAttendeesByEventId(eventId)
      .then((data) => setAttendees(data))
      .finally(() => setLoading(false));
  }, [eventId]);

  if (loading) return <div>Loading attendees...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Attendees for Event #{eventId}
      </h1>
      <AttendeeTable attendees={attendees} />
    </div>
  );
}
