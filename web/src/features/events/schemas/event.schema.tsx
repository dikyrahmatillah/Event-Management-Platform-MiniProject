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
  ticketTypes: z
    .array(
      z.object({
        type: z.enum(["Pre Sale", "Regular", "VIP"]),
        price: z.number().min(0, "Price must be positive"),
        availableSeat: z.number().int().min(1, "Seat must be at least 1"),
      })
    )
    .min(1, "Select at least one ticket type"),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
