import z from "zod";

export const eventSchema = z.object({
  organizerId: z.number(),
  eventName: z.string().max(255),
  description: z.string().optional(),
  category: z.string().optional(),
  location: z.string().max(255),
  price: z.number().nonnegative().optional().default(0),
  startDate: z.date().default(() => new Date()),
  endDate: z
    .date()
    .default(() => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
  totalSeats: z.number().int().nonnegative().optional().default(0),
  availableSeats: z.number().int().nonnegative().optional().default(0),
  imageUrl: z.url().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "CANCELLED"]).default("ACTIVE"),
});

export type EventInput = z.infer<typeof eventSchema>;
