import { prisma } from "@/configs/prisma.config.js";
import { CouponInput } from "@/validations/coupon.validation.js";

export class CouponService {
  async createCoupon(data: CouponInput) {
    return await prisma.coupon.create({
      data: {
        userId: data.userId,
        couponCode: data.couponCode,
        discountAmount: data.discountAmount ?? 0,
        discountPercentage: data.discountPercentage ?? 0,
        validFrom: data.validFrom,
        validUntil: data.validUntil,
        status: data.status,
      },
    });
  }
}
