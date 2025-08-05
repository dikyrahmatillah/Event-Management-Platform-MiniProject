import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { EventInput } from "@/validations/event.validation.js";

export class EventService {
  async createEvent(data: EventInput) {
    const newEvent = await prisma.event.create({
      data: {
        organizerId: data.organizerId,
        eventName: data.eventName,
        description: data.description,
        category: data.category,
        location: data.location,
        price: data.price,
        startDate: data.startDate,
        endDate: data.endDate,
        totalSeats: data.totalSeats,
        availableSeats: data.availableSeats,
        imageUrl: data.imageUrl,
      },
    });
    return newEvent;
  }

  async getEventById(eventId: number) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new AppError("Event not found", 404);
    return event;
  }

  async updateEvent(eventId: number, data: Partial<EventInput>) {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!existingEvent) throw new AppError("Event not found", 404);
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...existingEvent,
        ...data,
      },
    });
    return updatedEvent;
  }

  async deleteEvent(eventId: number) {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!existingEvent) throw new AppError("Event not found", 404);
    await prisma.event.delete({
      where: { id: eventId },
    });
    return { message: "Event deleted successfully" };
  }

  async getEventsByOrganizer(organizerId: number) {
    return prisma.event.findMany({ where: { organizerId } });
  }
}
