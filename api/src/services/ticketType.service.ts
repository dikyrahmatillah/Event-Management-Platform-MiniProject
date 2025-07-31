import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { TicketTypeInput } from "@/validations/ticketType.validation.js";

export class TicketTypeService {
  async organizerIdMatches(eventId: number, userId: number) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new AppError("Event not found", 404);
    if (event.organizerId !== userId)
      throw new AppError("Organizer ID does not match", 403);

    return true;
  }

  async createTickets(tickets: TicketTypeInput[]) {
    const createdTickets = await prisma.ticketType.createMany({
      data: tickets,
    });
    return createdTickets;
  }
}
