import { PointService } from "@/services/point.service.js";
import { pointSchema } from "@/validations/point.validation.js";
import { NextFunction, Request, Response } from "express";

export class PointController {
  private pointService = new PointService();

  createPoint = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
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
  };

  getUserPoints = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(request.params.userId);
      const points = await this.pointService.getUserPoints(userId);
      return response.status(200).json({
        message: "User points retrieved successfully",
        data: points,
      });
    } catch (error) {
      next(error);
    }
  };

  getPointHistory = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(request.params.userId);
      const history = await this.pointService.getPointHistory(userId);
      return response.status(200).json({
        message: "Point history retrieved successfully",
        data: history,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const pointController = new PointController();
