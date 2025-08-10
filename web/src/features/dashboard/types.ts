export type UserRole = "ORGANIZER" | "CUSTOMER";

export interface CouponData {
  id: number;
  code: string;
  discount: string;
  validUntil: string;
  isUsed: boolean;
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  location: string;
  attendeeCount: number;
  imageUrl?: string;
}
