import { TicketTypeService } from "@/services/ticketType.service.js";
import { NextFunction, Request, Response } from "express";

export class TicketController {
  private ticketTypeService = new TicketTypeService();

  createTickets = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const tickets = Array.isArray(request.body)
        ? request.body
        : [request.body];

      const eventId = tickets[0].eventId;
      await this.ticketTypeService.organizerIdMatches(eventId, request.user.id);

      const newTickets = await this.ticketTypeService.createTickets(tickets);
<<<<<<< HEAD
<<<<<<< HEAD
      return response.status(201).json(newTickets);
=======
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
      return response.status(201).json({
        message: "Tickets created successfully",
        data: newTickets,
      });
<<<<<<< HEAD
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  };
}

export const ticketController = new TicketController();
