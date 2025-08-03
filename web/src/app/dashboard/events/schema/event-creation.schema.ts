// schema.ts
import { z } from "zod";

export const eventFormSchema = z.object({
  eventBanner: z.custom<File>((file) => file instanceof File, {
    message: "Image is required",
  }),
  eventName: z.string().min(1, "Event name is required"),
  eventDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  startDate: z.date("Start date is required"),
  endDate: z.date("End date is required"),
  price: z.number().min(0, "Price must be positive"),
  availableSeat: z.number().int().min(1, "Seat must be at least 1"),
  ticketTypes: z.array(z.enum(["Pre Sale", "Regular", "VIP"])).optional(),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
