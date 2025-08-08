import { eventController } from "@/controllers/event.controller.js";
import { upload } from "@/middlewares/upload.middleware.js";
import { verifyOrganizer } from "@/middlewares/verifyOrganizer.middleware.js";
import { verifyToken } from "@/middlewares/verifyToken.middleware.js";
import { Router } from "express";
import express from "express";

const router = Router();

router.get("/", eventController.getEvents); // Get all events with filters
router.get("/:id", eventController.getEventById); // Get single event

// Protected routes (require authentication)
router.use(express.json());

router.post(
  "/create",
  verifyToken,
  verifyOrganizer,
  upload.single("imageUrl"),
  eventController.createEvent
);
router.get("/organizer/:id", eventController.getAllEventsByOrganizer);
router.get("/details/:id", eventController.getEventById);

router.put(
  "/:id",
  verifyToken,
  verifyOrganizer,
  upload.single("imageUrl"),
  eventController.updateEvent
);
router.delete(
  "/:id",
  verifyToken,
  verifyOrganizer,
  eventController.deleteEvent
);
router.get("/organizer/my-events", eventController.getMyEvents);

export default router;
