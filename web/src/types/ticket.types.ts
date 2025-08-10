import { z } from "zod";

export interface TicketTypes {
  id: number;
  eventId: number;
  typeName: string;
  description?: string;
  price: number;
  quantity: number;
  availableQuantity: number;
}

export interface TicketTypeFormProps {
  eventId: number;
  editingTicket: TicketTypes | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ticketTypeSchema = z.object({
  typeName: z.string().min(1, "Ticket type name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export type TicketTypesListResponse = TicketTypes[];
export type TicketTypeFormData = z.infer<typeof ticketTypeSchema>;
