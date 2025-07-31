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
      const totalAttendees = await this.attendeeService.countAttendees({
        eventId,
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
      response.status(204).send();
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
      response.status(204).send();
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
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const attendeeController = new AttendeeController();
