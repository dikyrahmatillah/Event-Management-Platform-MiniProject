import axios from "axios";
import { TransactionInput } from "@/types/transaction.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class TransactionService {
  async createTransaction(transactionData: TransactionInput) {
    const res = await apiClient.post("/transactions", transactionData);
    return res.data.data;
  }

  async getTransactionById(transactionId: number) {
    const res = await apiClient.get(`/transactions/${transactionId}`);
    return res.data.data;
  }
  async updateTransaction(
    transactionId: number,
    transactionData: TransactionInput,
    token: string
  ) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiClient.put(
      `/transactions/${transactionId}`,
      transactionData,
      { headers }
    );
    return res.data.data;
  }

  async deleteTransaction(transactionId: number, token: string) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiClient.delete(`/transactions/${transactionId}`, {
      headers,
    });
    return res.data.data;
  }
  async getTransactionsByUserId(userId: number, token: string) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiClient.get(`/transactions/user/${userId}`, {
      headers,
    });
    return res.data.data;
  }

  async getAnalytics(timeRange: string = "this-day", token: string) {
    const params: { timeRange: string } = { timeRange };
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const res = await apiClient.get("/transactions/analytics", {
      params,
      headers,
    });
    return res.data.data;
  }

  async getTransactionsWaitingConfirmation(token: string) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiClient.get("/transactions/waiting-confirmation", {
      headers,
    });
    return res.data.data;
  }

  async updateTransactionStatus(
    transactionId: number,
    status: "DONE" | "REJECTED",
    token: string
  ) {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiClient.patch(
      `/transactions/${transactionId}/status`,
      { newStatus: status },
      { headers }
    );
    return res.data.data;
  }
}

export const transactionService = new TransactionService();
