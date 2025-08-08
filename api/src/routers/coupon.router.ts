import { Router } from "express";
import { couponController } from "@/controllers/coupon.controller.js";
import { verifyToken } from "@/middlewares/verifyToken.middleware.js";
import { verifyOrganizer } from "@/middlewares/verifyOrganizer.middleware.js";

const router = Router();

router.get("/user/:userId", verifyToken, couponController.getUserCoupons);
router.get(
  "/user/:userId/active",
  verifyToken,
  couponController.getActiveCoupons
);

export default router;
