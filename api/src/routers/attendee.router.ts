import { Router } from "express";
import { attendeeController } from "@/controllers/attendee.controller.js";

const router = Router();

router.post("/", attendeeController.createAttendee);
router.get("/event/:eventId", attendeeController.getAttendeesByEventId);
router.get("/user/:userId", attendeeController.getAttendeesByUserId);
router.get(
  "/transaction/:transactionId",
  attendeeController.getAttendeesByTransactionId
);
router.delete("/event/:eventId", attendeeController.deleteAttendeesByEventId);
router.delete("/user/:userId", attendeeController.deleteAttendeesByUserId);
router.get("/:attendeeId", attendeeController.getAttendeeById);
router.put("/:attendeeId", attendeeController.updateAttendee);
router.delete("/:attendeeId", attendeeController.deleteAttendee);

export default router;
