import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Coupon {
  id: number;
  userId: number;
  couponCode: string;
  discountAmount?: number;
  discountPercentage?: number;
  validFrom: string;
  validUntil: string;
  status: "ACTIVE" | "USED" | "EXPIRED";
  createdAt: string;
  updatedAt: string;
}

export interface CouponData {
  id: number;
  code: string;
  discount: string;
  validUntil: string;
  isUsed: boolean;
  discountType: "amount" | "percentage";
  discountValue: number;
}

class CouponService {
  async getUserCoupons(userId: number, token: string): Promise<CouponData[]> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiClient.get(`/coupons/user/${userId}`, {
      headers,
    });
    return res.data.data;
  }

  async getActiveCoupons(userId: number, token: string): Promise<CouponData[]> {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await apiClient.get(`/coupons/user/${userId}/active`, {
      headers,
    });
    return res.data.data;
  }
}

export const couponService = new CouponService();
