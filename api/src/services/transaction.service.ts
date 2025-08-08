import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { TransactionInput } from "@/validations/transaction.validation.js";
import { orderQueue } from "@/queues/order.queues.js";

export class TransactionService {
  async createTransaction(transactionData: TransactionInput) {
    const transaction = await prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: transactionData.eventId },
      });

      if (!event || event.availableSeats < transactionData.quantity) {
        throw new AppError("Event not found or insufficient seats", 404);
      }

      const createdTransaction = await tx.transaction.create({
        data: {
          ...transactionData,
          finalAmount: Number(event.price) * transactionData.quantity,
        },
      });
      await tx.event.update({
        where: { id: event.id },
        data: { availableSeats: { decrement: transactionData.quantity } },
      });

      // Handle points usage through PointTransaction model
      if (transactionData.pointsUsed) {
        await tx.pointTransaction.create({
          data: {
            userId: transactionData.userId,
            transactionId: createdTransaction.id,
            pointsAmount: transactionData.pointsUsed,
            type: "USED",
            description: `Points used for transaction ${createdTransaction.transactionCode}`,
          },
        });

        // Update the user's point balance
        const userPoint = await tx.point.findFirst({
          where: { userId: transactionData.userId },
          orderBy: { createdAt: "desc" },
        });

        if (userPoint) {
          await tx.point.update({
            where: { id: userPoint.id },
            data: {
              pointsUsed: { increment: transactionData.pointsUsed },
              balance: { decrement: transactionData.pointsUsed },
            },
          });
        }
      }

      return createdTransaction;
    });
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
    transactionData: Partial<TransactionInput>
  ) {
    if (!transactionId || isNaN(transactionId)) {
      throw new AppError("Invalid transaction ID", 400);
    }
    if (!transactionData || Object.keys(transactionData).length === 0) {
      throw new AppError("No update data provided", 400);
    }
    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: transactionData,
    });
    if (!updatedTransaction) throw new AppError("Transaction not found", 404);
    return updatedTransaction;
  }

  async updateTransactionStatus(
    transactionId: number,
    newStatus: "DONE" | "REJECTED"
  ) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    const transactionStatus = await prisma.$transaction(async (tx) => {
      await tx.transaction.update({
        where: { id: transactionId },
        data: { status: newStatus },
      });

      if (newStatus === "REJECTED") {
        // Get transaction details to update the specific ticket types
        const transactionDetails = await tx.transactionDetail.findMany({
          where: { transactionId: transaction.id },
        });

        // If no transaction details exist (old system), fall back to event update
        if (transactionDetails.length === 0) {
          await tx.event.update({
            where: { id: transaction.eventId },
            data: { availableSeats: { increment: transaction.quantity } },
          });
        } else {
          // Update specific ticket types
          for (const detail of transactionDetails) {
            await tx.ticketType.update({
              where: { id: detail.ticketTypeId },
              data: { availableQuantity: { increment: detail.quantity } },
            });
          }
        }

        if (transaction.pointsUsed > 0) {
          await tx.pointTransaction.create({
            data: {
              userId: transaction.userId,
              transactionId: transaction.id,
              pointsAmount: transaction.pointsUsed,
              type: "REFUNDED",
              description: `Points refunded for rejected transaction ${transaction.transactionCode}`,
            },
          });

          const userPoint = await tx.point.findFirst({
            where: { userId: transaction.userId },
            orderBy: { createdAt: "desc" },
          });

          if (userPoint) {
            await tx.point.update({
              where: { id: userPoint.id },
              data: {
                pointsUsed: { decrement: transaction.pointsUsed },
                balance: { increment: transaction.pointsUsed },
                description: `Points refunded for transaction ${transaction.transactionCode}`,
              },
            });
          }
        }

        // Restore coupon status if a coupon was used
        if (Number(transaction.discountAmount) > 0) {
          const txCoupon = await tx.transactionCoupon.findFirst({
            where: { transactionId: transaction.id },
          });
          if (txCoupon && txCoupon.couponId) {
            await tx.coupon.update({
              where: { id: txCoupon.couponId },
              data: {
                status: "ACTIVE",
              },
            });
          }
        }
      }

      const attendeeCount = await tx.attendee.count({
        where: { transactionId: transaction.id },
      });
      if (attendeeCount === 0) {
        const attendeesToCreate = Array.from({
          length: transaction.quantity,
        }).map(() => ({
          transactionId: transaction.id,
          userId: transaction.userId,
          eventId: transaction.eventId,
        }));
        await tx.attendee.createMany({ data: attendeesToCreate });
      }
    });

    await orderQueue.remove(transactionId.toString());

    return transactionStatus;
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

  async getTransactionsWaitingConfirmation(organizerId: number) {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: "WAITING_CONFIRMATION",
        Event: {
          organizerId: organizerId,
        },
      },
      include: {
        User: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        Event: {
          select: {
            id: true,
            eventName: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return transactions;
  }

  async getAnalytics(timeRange: string, organizerId?: number) {
    const now = new Date();
    let startDate: Date;

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

    const whereClause: any = {
      status: "DONE",
      createdAt: {
        gte: startDate,
        lte: now,
      },
    };

    if (organizerId) {
      whereClause.Event = {
        organizerId: organizerId,
      };
    }

    const revenueResult = await prisma.transaction.aggregate({
      where: whereClause,
      _sum: {
        finalAmount: true,
      },
    });

    const attendeeResult = await prisma.transaction.aggregate({
      where: whereClause,
      _count: {
        id: true,
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      select: {
        createdAt: true,
        finalAmount: true,
      },
    });

    const dailyDataMap = new Map<
      string,
      { revenue: number; attendee: number }
    >();

    transactions.forEach((transaction) => {
      const dateKey = transaction.createdAt.toISOString().split("T")[0];
      const existing = dailyDataMap.get(dateKey) || { revenue: 0, attendee: 0 };

      dailyDataMap.set(dateKey, {
        revenue: existing.revenue + Number(transaction.finalAmount || 0),
        attendee: existing.attendee + 1,
      });
    });

    const processedDailyData = Array.from(dailyDataMap.entries())
      .map(([date, data]) => ({
        date,
        revenue: data.revenue,
        attendee: data.attendee,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalRevenue: Number(revenueResult._sum.finalAmount || 0),
      totalAttendees: attendeeResult._count.id,
      dailyData: processedDailyData,
    };
  }
}
