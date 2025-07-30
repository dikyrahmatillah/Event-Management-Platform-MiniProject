import z from "zod";

export const pointSchema = z.object({
  userId: z.number(),
  pointsEarned: z.number().int().default(0),
  pointsUsed: z.number().int().default(0),
  balance: z.number().int().default(0),
  description: z.string().optional(),
  expiresAt: z.date(),
});

export type PointInput = z.infer<typeof pointSchema>;
