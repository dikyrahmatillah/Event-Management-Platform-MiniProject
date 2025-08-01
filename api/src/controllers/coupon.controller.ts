import { CouponService } from "@/services/coupon.service.js";
<<<<<<< HEAD
import { CouponInput, couponSchema } from "@/validations/coupon.validation.js";
=======
import { couponSchema } from "@/validations/coupon.validation.js";
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
import { NextFunction, Request, Response } from "express";

export class CouponController {
  private couponService = new CouponService();

  async createCoupon(request: Request, response: Response, next: NextFunction) {
    try {
      const data = { ...request.body, userId: request.user.id };
      const validatedData = couponSchema.parse(data);
      const coupon = await this.couponService.createCoupon(validatedData);
<<<<<<< HEAD
      return response.status(201).json(coupon);
=======
      return response
        .status(201)
        .json({ message: "Coupon created successfully" });
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  }
}

export const couponController = new CouponController();
