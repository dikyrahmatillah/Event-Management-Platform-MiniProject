import { AttendeeService } from "@/services/attendee.service.js";
import {
  attendeeSchema,
  attendeeUpdateSchema,
} from "@/validations/attendee.validation.js";
import { NextFunction, Request, Response } from "express";

export class AttendeeController {
  private attendeeService = new AttendeeService();

  createAttendee = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const validated = attendeeSchema.parse(request.body);
      const attendee = await this.attendeeService.createAttendee(validated);
      response.status(201).json({
        message: "Attendee created successfully",
        data: attendee,
      });
    } catch (error) {
      next(error);
    }
  };

  getAttendeesByEventId = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const eventId = Number(request.params.eventId);
      const page = Number(request.query.page);
      const limit = Number(request.query.limit);
      const attendees = await this.attendeeService.getAttendeesByEventId(
        eventId,
        page,
        limit
      );

      // Transform the data to include ticket quantity and total price
      const transformedAttendees = attendees.map((attendee: any) => {
        const transaction = attendee.Transaction;
        const totalQuantity =
          transaction?.TransactionDetails?.reduce(
            (sum: number, detail: any) => sum + detail.quantity,
            0
          ) || 0;
        const totalPrice =
          transaction?.TransactionDetails?.reduce(
            (sum: number, detail: any) => sum + Number(detail.totalPrice),
            0
          ) || 0;

        return {
          id: attendee.id,
          userId: attendee.userId,
          eventId: attendee.eventId,
          transactionId: attendee.transactionId,
          name: `${attendee.User?.firstName} ${attendee.User?.lastName || ""}`.trim(),
          ticketQuantity: totalQuantity,
          totalPrice: totalPrice,
          eventName: attendee.Event?.eventName,
          status: attendee.status,
          attendedAt: attendee.attendedAt,
          createdAt: attendee.createdAt,
        };
      });

      const totalAttendees = await this.attendeeService.countAttendees({
        eventId,
      });
      response.status(200).json({
        data: transformedAttendees,
        page: Number(page),
        limit: Number(limit),
        totalPage: Math.ceil(totalAttendees / Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  };

  getAttendeesByUserId = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = Number(request.params.userId);
      const page = Number(request.query.page);
      const limit = Number(request.query.limit);
      const attendees = await this.attendeeService.getAttendeesByUserId(
        userId,
        page,
        limit
      );
      const totalAttendees = await this.attendeeService.countAttendees({
        userId,
      });
      response.status(200).json({
        data: attendees,
        page: Number(page),
        limit: Number(limit),
        totalPage: Math.ceil(totalAttendees / Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  };

  getAttendeesByTransactionId = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const transactionId = Number(request.params.transactionId);
      const page = Number(request.query.page);
      const limit = Number(request.query.limit);
      const attendees = await this.attendeeService.getAttendeesByTransactionId(
        transactionId,
        page,
        limit
      );
      const totalAttendees = await this.attendeeService.countAttendees({
        transactionId,
      });
      response.status(200).json({
        data: attendees,
        page: Number(page),
        limit: Number(limit),
        totalPage: Math.ceil(totalAttendees / Number(limit)),
      });
    } catch (error) {
      next(error);
    }
  };

  getAttendeeById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const attendeeId = Number(request.params.attendeeId);
      const attendee = await this.attendeeService.getAttendeeById(attendeeId);
      response.status(200).json({ data: attendee });
    } catch (error) {
      next(error);
    }
  };

  updateAttendee = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const attendeeId = Number(request.params.attendeeId);
      const status = attendeeUpdateSchema.parse(request.body);
      const updatedAttendee = await this.attendeeService.updateAttendee(
        attendeeId,
        status
      );
      response.status(200).json({
        message: "Attendee updated successfully",
        data: updatedAttendee,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteAttendee = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const attendeeId = Number(request.params.attendeeId);
      await this.attendeeService.deleteAttendee(attendeeId);
      response.status(200).json({ message: "Attendee deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  deleteAttendeesByEventId = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const eventId = Number(request.params.eventId);
      await this.attendeeService.deleteAttendeesByEventId(eventId);
      response.status(200).json({ message: "Attendees deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  deleteAttendeesByUserId = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = Number(request.params.userId);
      await this.attendeeService.deleteAttendeesByUserId(userId);
      response.status(200).json({ message: "Attendees deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
}

export const attendeeController = new AttendeeController();
