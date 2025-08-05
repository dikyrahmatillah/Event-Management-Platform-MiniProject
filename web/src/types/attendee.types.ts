export type Attendee = {
  id: number;
  userId: number;
  eventId: number;
  transactionId: number;
  name: string;
  ticketQuantity: number;
  totalPrice: number;
  eventName: string;
};

export type AttendeeListResponse = Attendee[];
