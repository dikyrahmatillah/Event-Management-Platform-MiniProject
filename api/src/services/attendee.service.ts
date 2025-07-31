import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import {
  AttendeeInput,
  attendeeUpdateSchema,
} from "@/validations/attendee.validation.js";

export class AttendeeService {
  async createAttendee(attendeeData: AttendeeInput) {
    const existingAttendee = await prisma.attendee.findFirst({
      where: {
        userId: attendeeData.userId,
        eventId: attendeeData.eventId,
      },
    });

    if (existingAttendee) {
      throw new AppError(
        "Attendee already exists for this event and user.",
        409
      );
    }

    const attendee = await prisma.attendee.create({
      data: attendeeData,
    });

    return attendee;
  }

  async getAttendeesByEventId(
    eventId: number,
    page = 1,
    limit = 20,
    status?: AttendeeInput["status"]
  ) {
    const { skip, take } = this.getPagination(page, limit);
    return prisma.attendee.findMany({
      where: {
        eventId,
        ...(status && { status }),
      },
      skip,
      take,
    });
  }

  async getAttendeesByUserId(
    userId: number,
    page = 1,
    limit = 20,
    status?: AttendeeInput["status"]
  ) {
    const { skip, take } = this.getPagination(page, limit);
    return prisma.attendee.findMany({
      where: {
        userId,
        ...(status && { status }),
      },
      skip,
      take,
    });
  }

  async getAttendeesByTransactionId(
    transactionId: number,
    page = 1,
    limit = 20,
    status?: AttendeeInput["status"]
  ) {
    const { skip, take } = this.getPagination(page, limit);
    return prisma.attendee.findMany({
      where: {
        transactionId,
        ...(status && { status }),
      },
      skip,
      take,
    });
  }

  async getAttendeeById(attendeeId: number) {
    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
    });

    if (!attendee) {
      throw new AppError("Attendee not found", 404);
    }
    return attendee;
  }

  async updateAttendee(attendeeId: number, status: Partial<AttendeeInput>) {
    const existingAttendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
    });

    if (!existingAttendee) {
      throw new AppError("Attendee not found", 404);
    }
    const updateStatus = attendeeUpdateSchema.parse(status);
    return prisma.attendee.update({
      where: { id: attendeeId },
      data: updateStatus,
    });
  }

  async deleteAttendee(attendeeId: number) {
    const attendee = await prisma.attendee.findUnique({
      where: { id: attendeeId },
    });

    if (!attendee) {
      throw new AppError("Attendee not found", 404);
    }
    return prisma.attendee.delete({
      where: { id: attendeeId },
    });
  }

  async deleteAttendeesByUserId(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }
    return prisma.attendee.deleteMany({
      where: { userId },
    });
  }

  async deleteAttendeesByTransactionId(transactionId: number) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }
    return prisma.attendee.deleteMany({
      where: { transactionId },
    });
  }

  async deleteAttendeesByEventId(eventId: number) {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new AppError("Event not found", 404);
    }
    return prisma.attendee.deleteMany({
      where: { eventId },
    });
  }

  getPagination(page = 1, limit = 20) {
    return { skip: (page - 1) * limit, take: limit };
  }
}
