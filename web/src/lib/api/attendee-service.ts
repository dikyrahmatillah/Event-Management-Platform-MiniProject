import axios from "axios";
import { AttendeeListResponse, Attendee } from "@/types/attendee.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class AttendeeService {
  async getAttendeesByEventId(eventId: number, token?: string) {
    const res = await apiClient.get<{ data: AttendeeListResponse }>(
      `/attendees/event/${eventId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return res.data.data || [];
  }

  async getAttendeeById(attendeeId: number, token?: string) {
    const res = await apiClient.get<{ data: Attendee }>(
      `/attendees/${attendeeId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    return res.data.data;
  }
}

export const attendeeService = new AttendeeService();
