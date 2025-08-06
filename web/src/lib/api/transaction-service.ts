import { TransactionInput } from "@/types/transaction.types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/";

class TransactionService {
  private async fetchWithErrorHandling(url: string, options?: RequestInit) {
    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  async createTransaction(
    transactionData: TransactionInput
  ): Promise<TransactionInput> {
    const url = `${API_BASE_URL}/api/v1/transactions`;
    return this.fetchWithErrorHandling(url, {
      method: "POST",
      body: JSON.stringify(transactionData),
    });
  }

  async getTransactionById(id: number): Promise<TransactionInput> {
    const url = `${API_BASE_URL}/api/v1/transactions/${id}`;
    return this.fetchWithErrorHandling(url);
  }

  async getAllTransactionsByUser(userId: number): Promise<TransactionInput[]> {
    const url = `${API_BASE_URL}/api/v1/transactions/user/${userId}`;
    const res = await this.fetchWithErrorHandling(url);
    return res.data;
  }

  async updateTransaction(
    id: number,
    transactionData: Partial<TransactionInput>
  ): Promise<TransactionInput> {
    const url = `${API_BASE_URL}/api/v1/transactions/${id}`;
    return this.fetchWithErrorHandling(url, {
      method: "PUT",
      body: JSON.stringify(transactionData),
    });
  }

  async deleteTransaction(id: number): Promise<void> {
    const url = `${API_BASE_URL}/api/v1/transactions/${id}`;
    await this.fetchWithErrorHandling(url, { method: "DELETE" });
  }
}

export const transactionService = new TransactionService();
