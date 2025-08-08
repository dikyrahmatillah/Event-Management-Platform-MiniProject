import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";

export class ReferralService {
  async applyReferral(
    referralCode: string,
    newUserId: number,
    referredUserId: number
  ) {
    const threeMonthsFromNow = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 30 * 3
    );

    const newUser = await prisma.user.findUnique({
      where: { id: newUserId },
      select: { firstName: true },
    });

    const newUserFirstName = newUser?.firstName || "someone";

    await prisma.$transaction(async (tx) => {
      await tx.point.create({
        data: {
          userId: referredUserId,
          pointsEarned: 10000,
          balance: 10000,
          description: `Referral bonus from referring ${newUser?.firstName}`,
          expiresAt: threeMonthsFromNow,
        },
      });

      await tx.coupon.create({
        data: {
          userId: newUserId,
          couponCode: `WELC5OFF${referralCode}`,
          discountPercentage: 5,
          validFrom: new Date(),
          validUntil: threeMonthsFromNow,
        },
      });
    });
  }

  async getReferrerId(referralCode: string) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
    });
    if (!referrer) throw new AppError("Invalid referral code", 400);

    return referrer.id;
  }
}
