//api>src>services>event.service.ts
import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { EventInput } from "@/validations/event.validation.js";

interface GetEventsParams {
  page: number;
  limit: number;
  category?: string;
  search?: string;
  location?: string;
  status?: string;
}

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
      include: {
        Organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
    return newEvent;
  }

  async getEvents(params: GetEventsParams) {
    const { page, limit, category, search, location, status } = params;
    const skip = (page - 1) * limit;

    const where: any = {
      status: status || "ACTIVE",
    };

    if (category) {
      where.category = {
        contains: category,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        {
          eventName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          startDate: "asc",
        },
        include: {
          Organizer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          _count: {
            select: {
              Reviews: true,
              Transactions: true,
            },
          },
        },
      }),
      prisma.event.count({ where }),
    ]);

    return {
      events,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }

  async getEventById(eventId: number) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        Organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            profilePicture: true,
          },
        },
        TicketTypes: true,
        Reviews: {
          include: {
            User: {
              select: {
                firstName: true,
                lastName: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            Reviews: true,
            Transactions: true,
          },
        },
      },
    });

    if (!event) throw new AppError("Event not found", 404);

    let totalSeats = 0;
    let availableSeats = 0;

    if (event.TicketTypes) {
      totalSeats = event.TicketTypes.reduce(
        (sum, ticket) => sum + (ticket.quantity ?? 0),
        0
      );
      availableSeats = event.TicketTypes.reduce(
        (sum, ticket) => sum + (ticket.availableQuantity ?? 0),
        0
      );
    } else {
      totalSeats = 0;
      availableSeats = 0;
    }

    return {
      ...event,
      totalSeats,
      availableSeats,
    };
  }

  async updateEvent(
    eventId: number,
    data: Partial<EventInput>,
    organizerId: number
  ) {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) throw new AppError("Event not found", 404);

    if (existingEvent.organizerId !== organizerId) {
      throw new AppError("Unauthorized to update this event", 401);
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        ...data,
      },
      include: {
        Organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return updatedEvent;
  }

  async deleteEvent(eventId: number, organizerId: number) {
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) throw new AppError("Event not found", 404);

    if (existingEvent.organizerId !== organizerId) {
      throw new AppError("Unauthorized to delete this event", 403);
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    return { message: "Event deleted successfully" };
  }

  async getEventsByOrganizer(organizerId: number, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const events = await prisma.event.findMany({
      where: { organizerId },
      skip,
      take: limit,
      orderBy: {
        startDate: "asc",
      },
      include: {
        Organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            Reviews: true,
            Transactions: true,
          },
        },
      },
    });

    const total = await prisma.event.count({
      where: { organizerId },
    });

    return {
      events,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }
}
