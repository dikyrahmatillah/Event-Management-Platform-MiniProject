import { AttendeeListResponse, Attendee } from "@/types/attendee.types";

class AttendeeService {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  /**
   * Fetch attendees for a specific event
   */
  async getAttendeesByEventId(
    eventId: number,
    token?: string
  ): Promise<AttendeeListResponse> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(
        `${this.baseUrl}/api/v1/attendees/event/${eventId}`,
        {
          headers,
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch attendees (${res.status})`
        );
      }

      const json = await res.json();
      return json.data;
    } catch (error) {
      console.error("Error fetching attendees:", error);
      throw error;
    }
  }

  /**
   * Get an attendee by ID
   */
  async getAttendeeById(attendeeId: number, token?: string): Promise<Attendee> {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(
        `${this.baseUrl}/api/v1/attendees/${attendeeId}`,
        {
          headers,
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch attendee (${res.status})`
        );
      }

      const json = await res.json();
      return json.data;
    } catch (error) {
      console.error("Error fetching attendee:", error);
      throw error;
    }
  }
}

// Export an instance for direct usage
export const attendeeService = new AttendeeService();

// Keep the original function for backward compatibility
export async function fetchAttendeesByEventId(
  eventId: number
): Promise<AttendeeListResponse> {
  return attendeeService.getAttendeesByEventId(eventId);
}
