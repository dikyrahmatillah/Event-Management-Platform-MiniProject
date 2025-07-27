import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { EmailService } from "@/services/email.service.js";
import {
  RegisterInput,
  UpdateProfileInput,
} from "@/validations/auth.validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  constructor(private emailService = new EmailService()) {}

  async registerUser(data: RegisterInput) {
    if (await prisma.user.findUnique({ where: { email: data.email } })) {
      throw new AppError("Email already exists", 400);
    }

    const referralCode = await this.generateReferralCode();
    const referredBy = await this.getReferrerId(data.referredByCode);

    const hashedPassword = await this.hashPassword(data.password);

    const profilePicture =
      data.profilePicture ||
      `https://github.com/identicons/${Math.floor(Math.random() * 10_000)}.png`;

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role,
        referralCode,
        profilePicture,
        referredBy,
      },
    });

    if (referredBy) await this.createReferralCoupon(newUser.id, referralCode);

    await this.emailService.sendWelcomeEmail(
      newUser.firstName,
      newUser.email,
      newUser.role
    );

    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const payload = { id: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1h",
      }
    );
    return { accessToken };
  }

  async getPublicProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profilePicture: true,
        role: true,
      },
    });
  }

  async getUserProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        profilePicture: true,
      },
    });
  }

  async updateProfile(userId: number, data: UpdateProfileInput) {
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!existingUser) throw new AppError("User not found", 404);
    await prisma.user.update({
      where: { id: userId },
      data: {
        ...existingUser,
        ...data,
      },
    });
    return { message: "Profile updated successfully" };
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      throw new AppError("Invalid old password", 401);
    }

    const hashedNewPassword = await this.hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return {
      message: "Password updated successfully",
    };
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 404);

    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "15m" }
    );

    await this.emailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: "Password reset email sent" };
  }

  async resetPassword(token: string, newPassword: string) {
    const { id, email } = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    ) as { id: number; email: string };

    if (!id || !email) throw new AppError("Invalid token", 400);

    const user = await prisma.user.findUnique({ where: { id, email } });
    if (!user) throw new AppError("User not found", 404);

    const hashedNewPassword = await this.hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });

    return { message: "Password updated successfully" };
  }

  private async generateReferralCode(): Promise<string> {
    let code: string = "";
    let exists = true;
    while (exists) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      exists = !!(await prisma.user.findUnique({
        where: { referralCode: code },
      }));
    }
    return code;
  }

  private async getReferrerId(referredByCode?: string) {
    if (!referredByCode) return null;

    const referrer = await prisma.user.findUnique({
      where: { referralCode: referredByCode },
    });

    if (!referrer) throw new AppError("Invalid referral code", 400);

    await prisma.point.create({
      data: {
        userId: referrer.id,
        pointsEarned: 10_000,
        description: "Referral bonus for referring a new user",
        balance: 10_000,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    return referrer.id;
  }

  private async createReferralCoupon(userId: number, referralCode: string) {
    await prisma.coupon.create({
      data: {
        userId,
        couponCode: `WELCOME-${referralCode}`,
        discountPercentage: 5,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
