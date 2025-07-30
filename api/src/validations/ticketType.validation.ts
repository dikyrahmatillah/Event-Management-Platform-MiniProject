import z from "zod";

export const ticketTypeSchema = z.object({
  eventId: z.number("Event ID must be a number"),
  typeName: z.string().max(100, "Type name must not exceed 100 characters"),
  description: z
    .string()
    .max(2000, "Description must not exceed 2000 characters")
    .optional(),
  price: z.number().min(0, "Price must be a non-negative number").default(0),
  quantity: z
    .number()
    .min(0, "Quantity must be a non-negative number")
    .default(0),
  availableQuantity: z
    .number()
    .min(0, "Available quantity must be a non-negative number")
    .default(0),
});

export type TicketTypeInput = z.infer<typeof ticketTypeSchema>;
