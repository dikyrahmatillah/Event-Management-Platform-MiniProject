// lib/api/eventService.ts

import { EventTypes } from "@/types/event.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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

  // Get all events with optional filters
  async getAllEvents(filters?: {
    status?: string;
    category?: string;
    organizerId?: number;
  }): Promise<EventTypes[]> {
    const params = new URLSearchParams();

    if (filters?.status) params.append("status", filters.status);
    if (filters?.category) params.append("category", filters.category);
    if (filters?.organizerId)
      params.append("organizerId", filters.organizerId.toString());

    const url = `${API_BASE_URL}/api/events${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    return this.fetchWithErrorHandling(url);
  }

  // Get single event by ID
  async getEventById(id: number): Promise<EventTypes> {
    const url = `${API_BASE_URL}/api/events/${id}`;
    return this.fetchWithErrorHandling(url);
  }

  // Create new event
  async createEvent(eventData: Omit<EventTypes, "id">): Promise<EventTypes> {
    const url = `${API_BASE_URL}/api/events`;
    return this.fetchWithErrorHandling(url, {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  }

  // Update existing event
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

  // Delete event
  async deleteEvent(id: number): Promise<EventTypes> {
    const url = `${API_BASE_URL}/api/events/${id}`;
    return this.fetchWithErrorHandling(url, {
      method: "DELETE",
    });
  }

  // Get events by status
  async getActiveEvents(): Promise<EventTypes[]> {
    return this.getAllEvents({ status: "ACTIVE" });
  }

  // Get events by category
  async getEventsByCategory(category: string): Promise<EventTypes[]> {
    return this.getAllEvents({ category });
  }

  // Search events (you could implement this on the backend)
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

// Export a singleton instance
export const eventService = new EventService();

// Export the class for testing or custom instances
export default EventService;
