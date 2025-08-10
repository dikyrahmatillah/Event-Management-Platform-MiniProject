import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import EventService from "@/lib/api/event-service";
import { EventTypes } from "@/types/event.type";

const eventService = new EventService();

export function useEvents() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventTypes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!session?.user?.id) return;
      try {
        setIsLoading(true);
        const response = await eventService.getAllEventsByOrganizer(
          Number(session.user.id)
        );
        setEvents(response);
      } catch (err) {
        setError("Failed to fetch events. Please try again.");
        console.error("Error fetching events:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, [session?.user?.id]);

  return { events, setEvents, isLoading, error };
}
