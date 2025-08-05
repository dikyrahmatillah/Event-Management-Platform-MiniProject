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
  private async fetchWithErrorHandling(
    url: string,
    options?: RequestInit,
    token?: string
  ) {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      if (options?.headers) {
        Object.assign(headers, options.headers);
      }
      const response = await fetch(url, {
        ...options,
        headers,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async getTicketsByEventId(
    eventId: number,
    token?: string
  ): Promise<TicketTypes[]> {
    try {
      const url = `${API_BASE_URL}/api/v1/tickets/${eventId}`;
      const res = await this.fetchWithErrorHandling(url, undefined, token);
      return res.data;
    } catch (error) {
      // Handle the case where no tickets are found as a normal empty state
      if (
        error instanceof Error &&
        error.message.includes("No tickets found")
      ) {
        return [];
      }
      throw error;
    }
  }

  async createTicketType(
    ticketData: CreateTicketTypeData,
    token?: string
  ): Promise<TicketTypes> {
    const url = `${API_BASE_URL}/api/v1/tickets`;
    const res = await this.fetchWithErrorHandling(
      url,
      {
        method: "POST",
        body: JSON.stringify(ticketData),
      },
      token
    );
    return res.data;
  }

  async updateTicketType(
    ticketId: number,
    ticketData: UpdateTicketTypeData,
    token?: string
  ): Promise<TicketTypes> {
    const url = `${API_BASE_URL}/api/v1/tickets/${ticketId}`;
    const res = await this.fetchWithErrorHandling(
      url,
      {
        method: "PUT",
        body: JSON.stringify(ticketData),
      },
      token
    );
    return res.data;
  }

  async deleteTicketType(ticketId: number, token?: string): Promise<void> {
    const url = `${API_BASE_URL}/api/v1/tickets/${ticketId}`;
    await this.fetchWithErrorHandling(
      url,
      {
        method: "DELETE",
      },
      token
    );
  }
}

export const ticketService = new TicketService();
export default ticketService;
