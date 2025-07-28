import z from "zod";

export const voucherCodeSchema = z.object({
  eventId: z.number("Event ID must be a positive integer"),
  voucherCode: z.string().max(50, "Voucher code must not exceed 50 characters"),
  discountAmount: z
    .number()
    .nonnegative("Discount amount must be a non-negative number")
    .optional()
    .default(0),
  discountPercentage: z
    .number()
    .min(0, "Discount percentage must be a non-negative number")
    .max(100, "Discount percentage must not exceed 100")
    .optional()
    .default(0),
  usageLimit: z
    .number()
    .min(1, "Usage limit must be at least 1")
    .optional()
    .default(1),
  usedCount: z
    .number()
    .min(0, "Used count must be a non-negative number")
    .optional()
    .default(0),
  validFrom: z.date("Valid from must be a valid date"),
  validUntil: z.date("Valid until must be a valid date"),
  status: z.enum(["ACTIVE", "INACTIVE", "EXPIRED"]).default("ACTIVE"),
});

export type VoucherInput = z.infer<typeof voucherCodeSchema>;
