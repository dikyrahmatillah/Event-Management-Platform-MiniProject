import { ticketController } from "@/controllers/ticketType.controller.js";
import { verifyOrganizer } from "@/middlewares/verifyOrganizer.middleware.js";
import { verifyToken } from "@/middlewares/verifyToken.middleware.js";
import { Router } from "express";

const router = Router();

<<<<<<< HEAD
router.post(
  "/create",
  verifyToken,
  verifyOrganizer,
  ticketController.createTickets
);
=======
router.post("/", verifyToken, verifyOrganizer, ticketController.createTickets);
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139

export default router;
