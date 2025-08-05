type EventStatus = "ACTIVE" | "INACTIVE" | "CANCELLED";

export type EventTypes = {
  id: number;
  organizerId: number;
  eventName: string;
  description: string;
  category: string;
  location: string;
  price: string;
  startDate: string;
  endDate: string;
  totalSeats: number;
  availableSeats: number;
  imageUrl: string;
  status: EventStatus;
};
