import { EventService } from "@/services/event.service.js";
import { EventInput, eventSchema } from "@/validations/event.validation.js";
import { NextFunction, Request, Response } from "express";
import { FileService } from "@/services/file.service.js";
import { eventNames } from "node:process";

export class EventController {
  private eventService = new EventService();
  private fileService = new FileService();

  createEvent = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const imageUrl = request.file
        ? await this.fileService.uploadPicture(request.file.path)
        : undefined;

      const body = {
        ...request.body,
        eventName: String(request.body.eventName),
        price: Number(request.body.price),
        startDate: String(request.body.startDate),
        endDate: String(request.body.endDate),
        totalSeats: Number(request.body.totalSeats),
        availableSeats: Number(request.body.availableSeats),
        imageUrl,
        organizerId: request.user.id,
      };

      const data = eventSchema.parse(body);

      const event = await this.eventService.createEvent(data);
      response
        .status(201)
        .json({ message: "Event created successfully", event });
    } catch (error) {
      next(error);
    }
  };

  getEvents = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const page = parseInt(request.query.page as string) || 1;
      const limit = parseInt(request.query.limit as string) || 10;
      const category = request.query.category as string;
      const search = request.query.search as string;
      const location = request.query.location as string;
      const status = request.query.status as string;

      const events = await this.eventService.getEvents({
        page,
        limit,
        category,
        search,
        location,
        status,
      });

      response.status(200).json({
        success: true,
        message: "Events retrieved successfully",
        data: events,
      });
    } catch (error) {
      next(error);
    }
  };

  getEventById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const eventId = parseInt(request.params.id);

      if (isNaN(eventId)) {
        return response.status(400).json({
          success: false,
          message: "Invalid event ID",
        });
      }

      const event = await this.eventService.getEventById(eventId);

      response.status(200).json({
        success: true,
        message: "Event retrieved successfully",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  };

  updateEvent = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const eventId = parseInt(request.params.id);

      if (isNaN(eventId)) {
        return response.status(400).json({
          success: false,
          message: "Invalid event ID",
        });
      }

      // Handle image upload if present
      const imageUrl = request.file
        ? await this.fileService.uploadPicture(request.file.path)
        : undefined;

      const body = {
        ...request.body,
        ...(request.body.price && { price: Number(request.body.price) }),
        ...(request.body.totalSeats && {
          totalSeats: Number(request.body.totalSeats),
        }),
        ...(request.body.availableSeats && {
          availableSeats: Number(request.body.availableSeats),
        }),
        ...(imageUrl && { imageUrl }),
      };

      // Validate partial data for update
      const partialEventSchema = eventSchema.partial();
      const data = partialEventSchema.parse(body);

      const updatedEvent = await this.eventService.updateEvent(
        eventId,
        data,
        request.user.id
      );

      response.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: updatedEvent,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteEvent = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const eventId = parseInt(request.params.id);

      if (isNaN(eventId)) {
        return response.status(400).json({
          success: false,
          message: "Invalid event ID",
        });
      }

      const result = await this.eventService.deleteEvent(
        eventId,
        request.user.id
      );

      response.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  };

  getMyEvents = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const organizerId = request.user.id;
      const page = parseInt(request.query.page as string) || 1;
      const limit = parseInt(request.query.limit as string) || 10;

      const events = await this.eventService.getEventsByOrganizer(organizerId, {
        page,
        limit,
      });

      response.status(200).json({
        success: true,
        message: "Your events retrieved successfully",
        data: events,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const eventController = new EventController();
