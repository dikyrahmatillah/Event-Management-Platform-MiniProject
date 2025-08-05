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
      return response.status(201).json({
        message: "Tickets created successfully",
        data: newTickets,
      });
    } catch (error) {
      next(error);
    }
  };

  getTicketsByEventId = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const eventId = Number(request.params.eventId);

      await this.ticketTypeService.organizerIdMatches(eventId, request.user.id);

      const tickets = await this.ticketTypeService.getTicketsByEventId(eventId);
      return response.status(200).json({
        message: "Tickets retrieved successfully",
        data: tickets,
      });
    } catch (error) {
      next(error);
    }
  };

  updateTicketType = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const ticketId = Number(request.params.ticketId);
      const ticketData = request.body;

      const updatedTicket = await this.ticketTypeService.updateTicketType(
        ticketId,
        ticketData
      );
      return response.status(200).json({
        message: "Ticket updated successfully",
        data: updatedTicket,
      });
    } catch (error) {
      next(error);
    }
  };
  deleteTicketType = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const ticketId = Number(request.params.ticketId);
      await this.ticketTypeService.deleteTicketType(ticketId);
      return response.status(200).json({
        message: "Ticket deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

export const ticketController = new TicketController();
