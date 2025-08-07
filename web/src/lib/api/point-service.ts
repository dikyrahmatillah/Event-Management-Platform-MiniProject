import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Point {
  id: number;
  userId: number;
  pointsEarned: number;
  pointsUsed: number;
  balance: number;
  description?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PointHistory {
  id: number;
  amount: number;
  description: string;
  date: string;
  type: "earned" | "used" | "refunded";
}

export interface PointsData {
  totalBalance: number;
  history: PointHistory[];
}

class PointService {
  async getUserPoints(userId: number, token: string): Promise<PointsData> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiClient.get(`/points/user/${userId}`, {
      headers,
    });
    return res.data.data;
  }

  async getPointHistory(
    userId: number,
    token: string
  ): Promise<PointHistory[]> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiClient.get(`/points/user/${userId}/history`, {
      headers,
    });
    return res.data.data;
  }
}

export const pointService = new PointService();
