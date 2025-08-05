import { AttendeeListResponse } from "@/types/attendee.types";

export async function fetchAttendeesByEventId(
  eventId: number
): Promise<AttendeeListResponse> {
  const res = await fetch(
    `http://localhost:8000/api/v1/attendees/event/${eventId}`
  );
  if (!res.ok) throw new Error("Failed to fetch attendees");
  const json = await res.json();
  return json.data;
}
