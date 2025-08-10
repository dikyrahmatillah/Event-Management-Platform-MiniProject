import { z } from "zod";
import { UseFormReturn } from "react-hook-form";

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

export const eventFormSchema = z.object({
  eventBanner: z.any().optional(),
  eventName: z.string(),
  eventDescription: z.string(),
  category: z.string(),
  location: z.string(),
  price: z.number(),
  totalSeats: z.number(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: eventStatusSchema,
  ticketTypes: z.array(z.string()).optional(),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
export type EventFormType = UseFormReturn<EventFormSchema>;
