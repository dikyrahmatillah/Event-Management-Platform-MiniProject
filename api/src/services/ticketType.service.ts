import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { TicketTypeInput } from "@/validations/ticketType.validation.js";

export class TicketTypeService {
  async organizerIdMatches(eventId: number, userId: number) {
    const event = await prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      select: { organizerId: true },
    });
    if (event.organizerId !== userId) {
      throw new AppError("You are not authorized to manage this event", 401);
    }
    return true;
  }

  async createTickets(tickets: TicketTypeInput[]) {
    const createdTickets = await prisma.ticketType.createMany({
      data: tickets,
    });
    return createdTickets;
  }

  async getTicketsByEventId(eventId: number) {
    const tickets = await prisma.ticketType.findMany({
      where: { eventId },
    });
    if (tickets.length === 0)
      throw new AppError("No tickets found for this event", 404);
    return tickets;
  }

  async updateTicketType(ticketId: number, ticketData: TicketTypeInput) {
    const updatedTicket = await prisma.ticketType.update({
      where: { id: ticketId },
      data: ticketData,
    });
    if (!updatedTicket) throw new AppError("Ticket not found", 404);
    return updatedTicket;
  }

  async deleteTicketType(ticketId: number) {
    const deletedTicket = await prisma.ticketType.delete({
      where: { id: ticketId },
    });
    if (!deletedTicket) throw new AppError("Ticket not found", 404);
    return deletedTicket;
  }
}
