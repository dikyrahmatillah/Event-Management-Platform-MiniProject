import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { attendeeService } from "@/lib/api/attendee-service";
import EventService from "@/lib/api/event-service";
import { Attendee } from "@/types/attendee.types";
import { toast } from "sonner";

export function useEventAttendees(eventId: number) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [statusDialog, setStatusDialog] = useState<{
    open: boolean;
    attendeeId: number | null;
    newStatus: "REGISTERED" | "ATTENDED" | "NO_SHOW" | null;
  }>({ open: false, attendeeId: null, newStatus: null });

  const { data: session } = useSession();

  const fetchAttendees = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError("");
    try {
      const eventService = new EventService();
      const eventData = await eventService.getEventById(eventId);
      if (eventData) setEventName(eventData.eventName);

      const token = session?.user?.accessToken;
      const attendeeData = await attendeeService.getAttendeesByEventId(
        eventId,
        token
      );
      setAttendees(attendeeData);
    } catch (err) {
      setError("Error fetching attendees. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [eventId, session]);

  useEffect(() => {
    fetchAttendees();
  }, [fetchAttendees]);

  const filteredAttendees =
    statusFilter === "ALL"
      ? attendees
      : attendees.filter((a) => a.status === statusFilter);

  const stats = {
    total: attendees.length,
    registered: attendees.filter((a) => a.status === "REGISTERED" || !a.status)
      .length,
    attended: attendees.filter((a) => a.status === "ATTENDED").length,
    noShow: attendees.filter((a) => a.status === "NO_SHOW").length,
  };

  const handleStatusUpdate = async (
    attendeeId: number,
    status: "REGISTERED" | "ATTENDED" | "NO_SHOW"
  ): Promise<void> => {
    setStatusDialog({ open: true, attendeeId, newStatus: status });
  };

  const confirmStatusUpdate = async () => {
    if (!statusDialog.attendeeId || !statusDialog.newStatus) return;
    setLoading(true);
    try {
      const token = session?.user?.accessToken;
      await attendeeService.updateAttendeeStatus(
        statusDialog.attendeeId,
        statusDialog.newStatus,
        token
      );
      setAttendees((prev) =>
        prev.map((attendee) =>
          attendee.id === statusDialog.attendeeId
            ? { ...attendee, status: statusDialog.newStatus ?? undefined }
            : attendee
        )
      );
      toast.success("Attendee status updated successfully!");
    } catch {
      toast.error("Error updating attendee status. Please try again.");
    } finally {
      setStatusDialog({ open: false, attendeeId: null, newStatus: null });
      setLoading(false);
    }
  };

  const reloadAttendees = () => fetchAttendees();

  return {
    attendees,
    eventName,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    filteredAttendees,
    stats,
    statusDialog,
    handleStatusUpdate,
    confirmStatusUpdate,
    setStatusDialog,
    reloadAttendees,
  };
}
