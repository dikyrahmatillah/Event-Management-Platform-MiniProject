import { EventService } from "@/services/event.service.js";
import { EventInput, eventSchema } from "@/validations/event.validation.js";
import { NextFunction, Request, Response } from "express";
import { FileService } from "@/services/file.service.js";

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
        price: Number(request.body.price),
        totalSeats: Number(request.body.totalSeats),
        availableSeats: Number(request.body.availableSeats),
        imageUrl,
        organizerId: request.user.id,
      };

      const data = eventSchema.parse(body);

      const event = await this.eventService.createEvent(
        data as unknown as EventInput
      );
      response
        .status(201)
        .json({ message: "Event created successfully", event });
    } catch (error) {
      next(error);
    }
  };
}

export const eventController = new EventController();
