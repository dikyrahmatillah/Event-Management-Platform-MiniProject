import { TicketTypes } from "@/types/ticket.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

export interface CreateTicketTypeData {
  eventId: number;
  typeName: string;
  description?: string;
  price: string;
  quantity: number;
  availableQuantity: number;
}

export interface UpdateTicketTypeData {
  typeName?: string;
  description?: string;
  price?: string;
  quantity?: number;
  availableQuantity?: number;
}

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

  async createTicketType(
    ticketData: CreateTicketTypeData
  ): Promise<TicketTypes> {
    const url = `${API_BASE_URL}/api/v1/tickets`;
    const res = await this.fetchWithErrorHandling(url, {
      method: "POST",
      body: JSON.stringify(ticketData),
    });
    return res.data;
  }

  async updateTicketType(
    ticketId: number,
    ticketData: UpdateTicketTypeData
  ): Promise<TicketTypes> {
    const url = `${API_BASE_URL}/api/v1/tickets/${ticketId}`;
    const res = await this.fetchWithErrorHandling(url, {
      method: "PUT",
      body: JSON.stringify(ticketData),
    });
    return res.data;
  }

  async deleteTicketType(ticketId: number): Promise<void> {
    const url = `${API_BASE_URL}/api/v1/tickets/${ticketId}`;
    await this.fetchWithErrorHandling(url, {
      method: "DELETE",
    });
  }
}

export const ticketService = new TicketService();
export default ticketService;
