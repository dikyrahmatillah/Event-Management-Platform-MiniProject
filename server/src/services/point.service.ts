import { prisma } from "@/configs/prisma.config.js";
import { PointInput } from "@/validations/point.validation.js";

export class PointService {
  async createPoint(data: PointInput) {
    const point = await prisma.point.create({
      data,
    });
    return point;
  }
}
