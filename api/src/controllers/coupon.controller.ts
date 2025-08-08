import { CouponService } from "@/services/coupon.service.js";
import { couponSchema } from "@/validations/coupon.validation.js";
import { NextFunction, Request, Response } from "express";

export class CouponController {
  private couponService = new CouponService();

  getUserCoupons = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(request.params.userId);
      const coupons = await this.couponService.getUserCoupons(userId);
      return response.status(200).json({
        message: "User coupons retrieved successfully",
        data: coupons,
      });
    } catch (error) {
      next(error);
    }
  };

  getActiveCoupons = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = parseInt(request.params.userId);
      const coupons = await this.couponService.getActiveCoupons(userId);
      return response.status(200).json({
        message: "Active coupons retrieved successfully",
        data: coupons,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const couponController = new CouponController();
