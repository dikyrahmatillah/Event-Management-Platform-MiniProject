import { prisma } from "@/configs/prisma.config.js";
import { CouponInput } from "@/validations/coupon.validation.js";

export class CouponService {
  async getUserCoupons(userId: number) {
    const coupons = await prisma.coupon.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return coupons.map((coupon) => ({
      id: coupon.id,
      code: coupon.couponCode,
      discount:
        coupon.discountPercentage && Number(coupon.discountPercentage) > 0
          ? `${coupon.discountPercentage}%`
          : `Rp ${Number(coupon.discountAmount || 0).toLocaleString()}`,
      validUntil: coupon.validUntil.toLocaleDateString("id-ID"),
      isUsed: coupon.status === "USED",
      discountType:
        coupon.discountPercentage && Number(coupon.discountPercentage) > 0
          ? "percentage"
          : "amount",
      discountValue:
        coupon.discountPercentage && Number(coupon.discountPercentage) > 0
          ? Number(coupon.discountPercentage)
          : Number(coupon.discountAmount || 0),
    }));
  }

  async getActiveCoupons(userId: number) {
    const coupons = await prisma.coupon.findMany({
      where: {
        userId,
        status: "ACTIVE",
        validUntil: {
          gte: new Date(),
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return coupons.map((coupon) => ({
      id: coupon.id,
      code: coupon.couponCode,
      discount:
        coupon.discountPercentage && Number(coupon.discountPercentage) > 0
          ? `${coupon.discountPercentage}%`
          : `Rp ${Number(coupon.discountAmount || 0).toLocaleString()}`,
      validUntil: coupon.validUntil.toLocaleDateString("id-ID"),
      isUsed: false,
      discountType:
        coupon.discountPercentage && Number(coupon.discountPercentage) > 0
          ? "percentage"
          : "amount",
      discountValue:
        coupon.discountPercentage && Number(coupon.discountPercentage) > 0
          ? Number(coupon.discountPercentage)
          : Number(coupon.discountAmount || 0),
    }));
  }
}
