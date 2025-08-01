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
<<<<<<< HEAD
<<<<<<< HEAD
      return response.status(201).json(point);
=======
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
      return response.status(201).json({
        message: "Point created successfully",
        data: point,
      });
<<<<<<< HEAD
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  }
}
