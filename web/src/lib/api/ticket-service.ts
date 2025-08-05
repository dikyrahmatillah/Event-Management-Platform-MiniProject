import { TicketTypes } from "@/types/ticket.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

class TicketService {
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

  async getTicketsByEventId(eventId: number): Promise<TicketTypes[]> {
    const url = `${API_BASE_URL}/api/v1/tickets/${eventId}`;
    const res = await this.fetchWithErrorHandling(url);
    return res.data;
  }
}

export const ticketService = new TicketService();
export default ticketService;
