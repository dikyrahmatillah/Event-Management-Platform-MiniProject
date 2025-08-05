import { ticketController } from "@/controllers/ticketType.controller.js";
import { verifyOrganizer } from "@/middlewares/verifyOrganizer.middleware.js";
import { verifyToken } from "@/middlewares/verifyToken.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/", verifyToken, verifyOrganizer, ticketController.createTickets);
router.get("/:eventId", ticketController.getTicketsByEventId);

export default router;
