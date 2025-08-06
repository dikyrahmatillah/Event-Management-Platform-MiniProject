export type Attendee = {
  id: number;
  userId: number;
  eventId: number;
  transactionId: number;
  name: string;
  ticketQuantity: number;
  totalPrice: number;
  eventName: string;
  status?: "REGISTERED" | "ATTENDED" | "NO_SHOW";
  attendedAt?: string | null;
  createdAt?: string;
};

export type AttendeeListResponse = Attendee[];
