import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";

export class ReferralService {
  async applyReferral(
    referralCode: String,
    newUserId: number,
    newUserName: String
  ) {
    const referredUser = await prisma.user.findUnique({
      where: { referralCode },
    });
    if (!referredUser) throw new AppError("Invalid referral code", 400);

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        data: {
          userId: newUserId,
          amount: 10000,
          expiredAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 3),
        },
      });
    });
  }
}
