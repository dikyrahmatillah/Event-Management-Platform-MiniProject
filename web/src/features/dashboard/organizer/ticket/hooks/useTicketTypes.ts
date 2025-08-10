import { useEffect, useState } from "react";
import EventService from "@/lib/api/event-service";
import { ticketService } from "@/lib/api/ticket-service";
import { toast } from "sonner";
import { EventTypes } from "@/types/event.type";
import { TicketTypes } from "@/types/ticket.types";

export function useTicketTypes(eventId: number, token?: string) {
  const [event, setEvent] = useState<EventTypes | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTicket, setEditingTicket] = useState<TicketTypes | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const eventService = new EventService();
      setEvent(await eventService.getEventById(eventId));
      setTicketTypes(await ticketService.getTicketsByEventId(eventId, token));
    } catch {
      toast.error("Failed to fetch event data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, token]);

  const handleEdit = (ticket: TicketTypes) => setEditingTicket(ticket);

  const handleDelete = async (ticketId: number) => {
    try {
      await ticketService.deleteTicketType(ticketId, token);
      toast.success("Ticket type deleted successfully");
      fetchData();
    } catch {
      toast.error("Failed to delete ticket type. Please try again.");
    }
  };

  return {
    event,
    ticketTypes,
    loading,
    refresh: fetchData,
    handleEdit,
    handleDelete,
    editingTicket,
    setEditingTicket,
  };
}
