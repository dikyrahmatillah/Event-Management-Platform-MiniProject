type EventCategory =
  | "seminar"
  | "festival"
  | "entertainment"
  | "music"
  | "sport";

export type EventTypes = {
  id: number;
  organizerId: number;
  eventName: string;
  description: string;
  category: EventCategory;
  location: string;
  price: string;
  startDate: string;
  endDate: string;
  totalSeats: number;
  availableSeats: number;
  imageUrl: string;
  status: EventStatus;
};
