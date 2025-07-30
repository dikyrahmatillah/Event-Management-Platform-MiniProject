import { eventController } from "@/controllers/event.controller.js";
import { upload } from "@/middlewares/upload.middleware.js";
import { verifyOrganizer } from "@/middlewares/verifyOrganizer.middleware.js";
import { verifyToken } from "@/middlewares/verifyToken.middleware.js";
import { Router } from "express";

const router = Router();

router.post(
  "/create",
  verifyToken,
  verifyOrganizer,
  upload.single("imageUrl"),
  eventController.createEvent
);

export default router;
