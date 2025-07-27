import z from "zod";

export const eventSchema = z.object({
  organizerId: z.number("Organizer ID must be a number"),
  eventName: z.string().max(255, "Event name cannot exceed 255 characters"),
  description: z.string().optional(),
  category: z.string().optional(),
  location: z.string().max(255, "Location cannot exceed 255 characters"),
  price: z
    .number()
    .nonnegative("Price must be a non-negative number")
    .optional()
    .default(0),
  startDate: z.date().default(() => new Date()),
  endDate: z
    .date()
    .default(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  totalSeats: z
    .number()
    .int()
    .nonnegative("Total seats must be a non-negative integer")
    .optional()
    .default(0),
  availableSeats: z
    .number()
    .int()
    .nonnegative("Available seats must be a non-negative integer")
    .optional()
    .default(0),
  imageUrl: z.url().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "CANCELLED"]).default("ACTIVE"),
});

export type EventInput = z.infer<typeof eventSchema>;
