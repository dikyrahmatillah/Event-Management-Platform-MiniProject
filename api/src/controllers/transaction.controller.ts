import { NextFunction, Request, Response } from "express";
import { TransactionService } from "@/services/transaction.service.js";

export class TransactionController {
  private transactionService = new TransactionService();

  createTransaction = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const transactionData = request.body;
      const createdTransaction =
        await this.transactionService.createTransaction(transactionData);
      return response.status(201).json({
        message: "Transaction created successfully",
        data: createdTransaction,
      });
    } catch (error) {
      next(error);
    }
  };

  getTransactionById = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const transactionId = Number(request.params.transactionId);
      const transaction =
        await this.transactionService.getTransactionById(transactionId);
      return response.status(200).json({
        message: "Transaction retrieved successfully",
        data: transaction,
      });
    } catch (error) {
      next(error);
    }
  };

  updateTransaction = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const transactionId = Number(request.params.transactionId);
      const transactionData = request.body;
      const updatedTransaction =
        await this.transactionService.updateTransaction(
          transactionId,
          transactionData
        );
      return response.status(200).json({
        message: "Transaction updated successfully",
        data: updatedTransaction,
      });
    } catch (error) {
      next(error);
    }
  };

  deleteTransaction = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const transactionId = Number(request.params.transactionId);
      const deletedTransaction =
        await this.transactionService.deleteTransaction(transactionId);
      return response.status(200).json({
        message: "Transaction deleted successfully",
        data: deletedTransaction,
      });
    } catch (error) {
      next(error);
    }
  };

  getTransactionsByUserId = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = Number(request.params.userId);
      const transactions =
        await this.transactionService.getTransactionsByUserId(userId);
      return response.status(200).json({
        message: "Transactions retrieved successfully",
        data: transactions,
      });
    } catch (error) {
      next(error);
    }
  };

  getAnalytics = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { timeRange } = request.query;
      const organizerId = request.user?.id; // Assuming auth middleware sets user

      const analytics = await this.transactionService.getAnalytics(
        (timeRange as string) || "this-day",
        organizerId
      );

      return response.status(200).json({
        message: "Analytics retrieved successfully",
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const transactionController = new TransactionController();
