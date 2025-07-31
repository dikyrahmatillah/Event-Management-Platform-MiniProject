import { PointService } from "@/services/point.service.js";
import { pointSchema } from "@/validations/point.validation.js";
import { NextFunction, Request, Response } from "express";

export class PointController {
  private pointService = new PointService();
  async createPoint(request: Request, response: Response, next: NextFunction) {
    try {
      const data = { ...request.body, userId: request.user.id };
      const validatedData = pointSchema.parse(data);
      const point = await this.pointService.createPoint(validatedData);
      return response.status(201).json({
        message: "Point created successfully",
        data: point,
      });
    } catch (error) {
      next(error);
    }
  }
}
