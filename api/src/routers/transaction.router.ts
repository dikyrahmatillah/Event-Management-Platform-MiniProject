import { transactionController } from "@/controllers/transaction.controller.js";
import { verifyOrganizer } from "@/middlewares/verifyOrganizer.middleware.js";
import { verifyToken } from "@/middlewares/verifyToken.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/", transactionController.createTransaction);
router.get(
  "/analytics",
  verifyToken,
  verifyOrganizer,
  transactionController.getAnalytics
);
router.get(
  "/waiting-confirmation",
  verifyToken,
  verifyOrganizer,
  transactionController.getTransactionsWaitingConfirmation
);
router.get("/:transactionId", transactionController.getTransactionById);
router.put(
  "/:transactionId",
  verifyToken,
  verifyOrganizer,
  transactionController.updateTransaction
);
router.delete(
  "/:transactionId",
  verifyToken,
  verifyOrganizer,
  transactionController.deleteTransaction
);
router.get("/user/:userId", transactionController.getTransactionsByUserId);
router.patch(
  "/:transactionId/status",
  verifyToken,
  verifyOrganizer,
  transactionController.updateTransactionStatus
);

export default router;
