import { transactionController } from "@/controllers/transaction.controller.js";
import { Router } from "express";

const router = Router();

router.post("/", transactionController.createTransaction);
router.get("/:transactionId", transactionController.getTransactionById);
router.put("/:transactionId", transactionController.updateTransaction);
router.delete("/:transactionId", transactionController.deleteTransaction);
router.get("/user/:userId", transactionController.getTransactionsByUserId);

export default router;
