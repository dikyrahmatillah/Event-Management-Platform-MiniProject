import z from "zod";

export const couponSchema = z.object({
  userId: z.number(),
  couponCode: z
    .string()
    .min(1, "Coupon code is required")
    .max(50, "Coupon code must be at most 50 characters long"),
  discountAmount: z.number("").optional(),
  discountPercentage: z.number().optional(),
  validFrom: z.date(),
  validUntil: z.date(),
  status: z.enum(["ACTIVE", "USED", "EXPIRED"]).default("ACTIVE"),
});

export type CouponInput = z.infer<typeof couponSchema>;
