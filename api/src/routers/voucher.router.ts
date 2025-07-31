import { Router } from "express";
import { voucherController } from "@/controllers/voucher.controller.js";
import { verifyToken } from "@/middlewares/verifyToken.middleware.js";
import { verifyOrganizer } from "@/middlewares/verifyOrganizer.middleware.js";

const router = Router();

router.post(
  "/:eventId/vouchers",
  verifyToken,
  verifyOrganizer,
  voucherController.createVoucher
);

export default router;
