
import { EventTypes } from "@/types/event.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

class EventService {
  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async getAllEventsByOrganizer(
    organizerId: number,
    params: { page?: number; limit?: number; category?: string } = {}
  ): Promise<EventTypes[]> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const url = `${API_BASE_URL}/api/v1/events/organizer/${organizerId}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const res = await this.fetchWithErrorHandling(url);
    return res.data;
  }

  async getEventById(id: number): Promise<EventTypes> {
    const url = `${API_BASE_URL}/api/v1/events/details/${id}`;
    const res = await this.fetchWithErrorHandling(url);
    return res.data;
  }

  async getAllEvents(
    filters: { status?: string; category?: string } = {}
  ): Promise<EventTypes[]> {
    const params = new URLSearchParams(filters);
    const url = `${API_BASE_URL}/api/events${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    return this.fetchWithErrorHandling(url);
  }

  async createEvent(eventData: Omit<EventTypes, "id">): Promise<EventTypes> {
    const url = `${API_BASE_URL}/api/events`;
    return this.fetchWithErrorHandling(url, {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(
    id: number,
    eventData: Partial<EventTypes>
  ): Promise<EventTypes> {
    const url = `${API_BASE_URL}/api/events/${id}`;
    return this.fetchWithErrorHandling(url, {
      method: "PUT",
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id: number): Promise<EventTypes> {
    const url = `${API_BASE_URL}/api/events/${id}`;
    return this.fetchWithErrorHandling(url, {
      method: "DELETE",
    });
  }

  async getActiveEvents(): Promise<EventTypes[]> {
    return this.getAllEvents({ status: "ACTIVE" });
  }

  async getEventsByCategory(category: string): Promise<EventTypes[]> {
    return this.getAllEvents({ category });
  }

  async searchEvents(query: string): Promise<EventTypes[]> {
    const allEvents = await this.getAllEvents();
    return allEvents.filter(
      (event) =>
        event.eventName.toLowerCase().includes(query.toLowerCase()) ||
        event.description.toLowerCase().includes(query.toLowerCase()) ||
        event.location.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const eventService = new EventService();

export default EventService;

