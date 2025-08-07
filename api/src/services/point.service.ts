import { prisma } from "@/configs/prisma.config.js";
import { PointInput } from "@/validations/point.validation.js";

export class PointService {
  async createPoint(data: PointInput) {
    const point = await prisma.point.create({
      data,
    });
    return point;
  }

  async getUserPoints(userId: number) {
    const points = await prisma.point.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const totalBalance = points.reduce((sum, point) => sum + point.balance, 0);

    const history = points.map((point) => ({
      id: point.id,
      amount: point.pointsEarned > 0 ? point.pointsEarned : -point.pointsUsed,
      description: point.description || "Point transaction",
      date: point.createdAt.toISOString().split("T")[0],
      type: point.pointsEarned > 0 ? "earned" : "used",
    }));

    return {
      totalBalance,
      history,
    };
  }

  async getPointHistory(userId: number) {
    const points = await prisma.point.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10, // Last 10 transactions
    });

    return points.map((point) => ({
      id: point.id,
      amount: point.pointsEarned > 0 ? point.pointsEarned : -point.pointsUsed,
      description: point.description || "Point transaction",
      date: point.createdAt.toISOString().split("T")[0],
      type: point.pointsEarned > 0 ? "earned" : "used",
    }));
  }
}
