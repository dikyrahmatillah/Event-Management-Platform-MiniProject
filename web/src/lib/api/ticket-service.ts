import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

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
  async getTicketsByEventId(eventId: number, token?: string) {
    const res = await apiClient.get(
      `/tickets/${eventId}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
    return res.data.data;
  }

  async createTicketType(ticketData: CreateTicketTypeData, token?: string) {
    const res = await apiClient.post(
      "/tickets",
      ticketData,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
    return res.data.data;
  }

  async updateTicketType(
    ticketId: number,
    ticketData: UpdateTicketTypeData,
    token?: string
  ) {
    const res = await apiClient.put(
      `/tickets/${ticketId}`,
      ticketData,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
    return res.data;
  }

  async deleteTicketType(ticketId: number, token?: string): Promise<void> {
    await apiClient.delete(
      `/tickets/${ticketId}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
    );
  }
}

export const ticketService = new TicketService();
