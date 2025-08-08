import { Router } from "express";
import { pointController } from "@/controllers/point.controller.js";
import { verifyToken } from "@/middlewares/verifyToken.middleware.js";

const router = Router();

router.post("/", verifyToken, pointController.createPoint);
router.get("/user/:userId", verifyToken, pointController.getUserPoints);
router.get(
  "/user/:userId/history",
  verifyToken,
  pointController.getPointHistory
);

export default router;
