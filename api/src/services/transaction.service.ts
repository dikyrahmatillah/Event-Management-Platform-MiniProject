import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { TransactionInput } from "@/validations/transaction.validation.js";

export class TransactionService {
  async createTransaction(transactionData: TransactionInput) {
    const createdTransaction = await prisma.transaction.create({
      data: transactionData,
    });
    return createdTransaction;
  }

  async getTransactionById(transactionId: number) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });
    if (!transaction) throw new AppError("Transaction not found", 404);
    return transaction;
  }

  async updateTransaction(
    transactionId: number,
    transactionData: TransactionInput
  ) {
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: transactionData,
    });
    if (!updatedTransaction) throw new AppError("Transaction not found", 404);
    return updatedTransaction;
  }

  async deleteTransaction(transactionId: number) {
    const deletedTransaction = await prisma.transaction.delete({
      where: { id: transactionId },
    });
    if (!deletedTransaction) throw new AppError("Transaction not found", 404);
    return deletedTransaction;
  }

  async getTransactionsByUserId(userId: number) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });
    if (transactions.length === 0)
      throw new AppError("No transactions found for this user", 404);
    return transactions;
  }

  async getAnalytics(timeRange: string, organizerId?: number) {
    const now = new Date();
    let startDate: Date;

    // Calculate date range based on timeRange
    switch (timeRange) {
      case "this-day":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "this-month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "this-year":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    // Build where clause
    const whereClause: any = {
      status: "DONE",
      createdAt: {
        gte: startDate,
        lte: now,
      },
    };

    // If organizerId is provided, filter by events owned by this organizer
    if (organizerId) {
      whereClause.Event = {
        organizerId: organizerId,
      };
    }

    // Get total revenue
    const revenueResult = await prisma.transaction.aggregate({
      where: whereClause,
      _sum: {
        finalAmount: true,
      },
    });

    // Get total attendees (tickets sold)
    const attendeesResult = await prisma.attendee.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: now,
        },
        ...(organizerId && {
          Event: {
            organizerId: organizerId,
          },
        }),
      },
      _count: {
        id: true,
      },
    });

    // Get daily data for charts
    const dailyData = await prisma.transaction.groupBy({
      by: ["createdAt"],
      where: whereClause,
      _sum: {
        finalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    // Process daily data
    const processedDailyData = dailyData.map((item) => ({
      date: item.createdAt.toISOString().split("T")[0],
      revenue: Number(item._sum.finalAmount || 0),
      tickets: item._count.id,
    }));

    return {
      totalRevenue: Number(revenueResult._sum.finalAmount || 0),
      totalAttendees: attendeesResult._count.id,
      dailyData: processedDailyData,
    };
  }
}
