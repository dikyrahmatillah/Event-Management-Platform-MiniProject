import { z } from "zod";

export const eventStatusSchema = z.enum(["ACTIVE", "INACTIVE", "CANCELLED"]);
export type EventStatus = z.infer<typeof eventStatusSchema>;

export const eventTypesSchema = z.object({
  id: z.number(),
  organizerId: z.number(),
  eventName: z.string(),
  description: z.string(),
  category: z.string(),
  location: z.string(),
  price: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  totalSeats: z.number(),
  availableSeats: z.number(),
  imageUrl: z.string().optional(),
  status: eventStatusSchema,
});
export type EventTypes = z.infer<typeof eventTypesSchema>;

export const ticketTypesSchema = z.object({
  id: z.number(),
  nameType: z.string(),
  price: z.number(),
  quantity: z.number(),
});
export type TicketTypes = z.infer<typeof ticketTypesSchema>;
