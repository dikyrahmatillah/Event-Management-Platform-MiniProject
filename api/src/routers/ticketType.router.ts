import { ticketController } from "@/controllers/ticketType.controller.js";
import { verifyOrganizer } from "@/middlewares/verifyOrganizer.middleware.js";
import { verifyToken } from "@/middlewares/verifyToken.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/", verifyToken, verifyOrganizer, ticketController.createTickets);
router.get(
  "/:eventId",
  verifyToken,
  verifyOrganizer,
  ticketController.getTicketsByEventId
);
router.put(
  "/:ticketId",
  verifyToken,
  verifyOrganizer,
  ticketController.updateTicketType
);
router.delete(
  "/:ticketId",
  verifyToken,
  verifyOrganizer,
  ticketController.deleteTicketType
);

export default router;
