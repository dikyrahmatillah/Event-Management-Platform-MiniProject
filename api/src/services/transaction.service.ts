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
}
