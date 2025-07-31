import { CouponService } from "@/services/coupon.service.js";
import { couponSchema } from "@/validations/coupon.validation.js";
import { NextFunction, Request, Response } from "express";

export class CouponController {
  private couponService = new CouponService();

  async createCoupon(request: Request, response: Response, next: NextFunction) {
    try {
      const data = { ...request.body, userId: request.user.id };
      const validatedData = couponSchema.parse(data);
      const coupon = await this.couponService.createCoupon(validatedData);
      return response
        .status(201)
        .json({ message: "Coupon created successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export const couponController = new CouponController();
