// Define all role types in one place for consistency
export type UserRole = "ORGANIZER" | "CUSTOMER" | "ADMIN";

// Type definitions for dashboard data models
export interface PointsData {
  total: number;
  history: {
    id: number;
    amount: number;
    description: string;
    date: string;
  }[];
}

export interface CouponData {
  id: number;
  code: string;
  discount: string;
  validUntil: string;
  isUsed: boolean;
}

export interface TransactionData {
  id: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  description: string;
}

export interface EventData {
  id: string;
  title: string;
  date: string;
  location: string;
  attendeeCount: number;
  imageUrl?: string;
}
