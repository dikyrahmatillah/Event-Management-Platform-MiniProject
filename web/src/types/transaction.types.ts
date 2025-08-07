import z from "zod";

export const transactionSchema = z.object({
  userId: z.number("User ID must be a number"),
  eventId: z.number("Event ID must be a number"),
  transactionCode: z
    .string()
    .max(50, "Transaction code must not exceed 50 characters"),
  quantity: z.number().min(1, "Quantity must be at least 1").default(1),
  subtotal: z
    .number()
    .min(0, "Subtotal must be a non-negative number")
    .default(0),
  discountAmount: z
    .number()
    .min(0, "Discount amount must be a non-negative number")
    .default(0),
  pointsUsed: z
    .number()
    .min(0, "Points used must be a non-negative number")
    .default(0),
  finalAmount: z
    .number()
    .min(0, "Final amount must be a non-negative number")
    .default(0),
  status: z
    .enum(
      [
        "WAITING_PAYMENT",
        "WAITING_CONFIRMATION",
        "DONE",
        "REJECTED",
        "EXPIRED",
        "CANCELLED",
      ],
      "Invalid transaction status"
    )
    .default("WAITING_PAYMENT"),
  paymentProof: z
    .string()
    .max(500, "Payment proof must not exceed 500 characters")
    .optional(),
  paymentDeadline: z.date().optional(),
});

export type TransactionInput = z.infer<typeof transactionSchema>;

export interface Transaction {
  id: number;
  userId: number;
  eventId: number;
  transactionCode: string;
  quantity: number;
  subtotal: number;
  discountAmount: number;
  pointsUsed: number;
  finalAmount: number;
  status:
    | "WAITING_PAYMENT"
    | "WAITING_CONFIRMATION"
    | "DONE"
    | "REJECTED"
    | "EXPIRED"
    | "CANCELLED";
  paymentProof?: string;
  paymentDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
  User?: {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
  };
  Event?: {
    id: number;
    eventName: string;
    price: number;
  };
}
