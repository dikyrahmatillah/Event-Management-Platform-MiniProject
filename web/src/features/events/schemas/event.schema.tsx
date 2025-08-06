import { z } from "zod";

export const eventFormSchema = z.object({
  eventBanner: z
    .custom<File>((file) => file instanceof File, {
      message: "Image is required",
    })
    .optional(),
  eventName: z.string().min(1, "Event name is required"),
  eventDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  price: z.number().min(0, "Price must be positive"),
  totalSeats: z.number().int().min(1, "Total seats must be at least 1"),
  startDate: z.date("Start date is required"),
  endDate: z.date("End date is required"),
  ticketTypes: z.array(z.string()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "CANCELLED"]),
});

export type EventFormSchema = z.infer<typeof eventFormSchema>;
