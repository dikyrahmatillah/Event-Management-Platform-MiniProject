import axios from "axios";
import { EventTypes } from "@/types/event.type";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class EventService {
  async getAllEventsByOrganizer(
    organizerId: number,
    params: { page?: number; limit?: number; category?: string } = {}
  ) {
    const { data } = await apiClient.get(`/events/organizer/${organizerId}`, {
      params,
    });
    return data;
  }

  async getEventById(id: number) {
    const { data } = await apiClient.get(`/events/details/${id}`);
    return data;
  }

  async updateEvent(id: number, eventData: Partial<EventTypes>) {
    const { data } = await apiClient.put<EventTypes>(
      `/events/${id}`,
      eventData
    );
    return data;
  }

  async deleteEvent(id: number) {
    const { data } = await apiClient.delete<EventTypes>(`/events/${id}`);
    return data;
  }

  async getAllEvents(filters: { status?: string; category?: string } = {}) {
    const filteredParams: Record<string, string> = {};
    if (filters.status !== undefined) filteredParams.status = filters.status;
    if (filters.category !== undefined)
      filteredParams.category = filters.category;

    const { data } = await apiClient.get<EventTypes[]>("/events", {
      params: filteredParams,
    });
    return data;
  }

  async createEvent(eventData: Omit<EventTypes, "id">) {
    const { data } = await apiClient.post<EventTypes>("/events", eventData);
    return data;
  }

  async getActiveEvents() {
    return this.getAllEvents({ status: "ACTIVE" });
  }

  async getEventsByCategory(category: string) {
    return this.getAllEvents({ category });
  }

  async searchEvents(query: string) {
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
