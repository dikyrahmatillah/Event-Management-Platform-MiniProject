import z from "zod";

export const attendeeSchema = z.object({
  userId: z.number(),
  eventId: z.number(),
  transactionId: z.number(),
  attendedAt: z.date().optional(),
  status: z.enum(["REGISTERED", "ATTENDED", "NO_SHOW"]).default("REGISTERED"),
});

export type AttendeeInput = z.infer<typeof attendeeSchema>;

export const attendeeUpdateSchema = attendeeSchema.partial();
