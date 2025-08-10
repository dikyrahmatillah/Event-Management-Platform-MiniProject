import { useEffect, useState } from "react";
import EventService from "@/lib/api/event-service";
import { ticketService } from "@/lib/api/ticket-service";
import { toast } from "sonner";
import { EventTypes } from "@/types/event.type";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export function useEventDetail(
  eventId: number,
  token?: string,
  router?: AppRouterInstance
) {
  const [event, setEvent] = useState<EventTypes | null>(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const eventData = await new EventService().getEventById(eventId);
        setEvent(eventData);
        try {
          const ticketData = await ticketService.getTicketsByEventId(
            eventId,
            token
          );
          setTicketTypes(ticketData);
        } catch {
          setTicketTypes([]);
        }
      } catch {
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    }
    if (eventId) fetchData();
  }, [eventId, token]);

  const handleDeleteEvent = async () => {
    if (!event) return;
    setLoading(true);
    try {
      await new EventService().deleteEvent(event.id, token);
      toast.success(`Event "${event.eventName}" deleted successfully`);
      router?.push("/dashboard/organizer/events");
    } catch {
      toast.error("Failed to delete event. Please try again.");
    } finally {
      setDeleteDialogOpen(false);
      setLoading(false);
    }
  };

  return {
    event,
    ticketTypes,
    loading,
    error,
    handleDeleteEvent,
    deleteDialogOpen,
    setDeleteDialogOpen,
  };
}
