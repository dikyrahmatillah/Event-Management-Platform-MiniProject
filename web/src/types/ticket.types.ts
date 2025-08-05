export interface TicketTypes {
  id: number;
  eventId: number;
  typeName: string;
  description?: string;
  price: number;
  quantity: number;
  availableQuantity: number;
}

export type TicketTypesListResponse = TicketTypes[];
