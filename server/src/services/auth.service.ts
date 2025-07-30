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

    let referredBy: number | null = null;
    let referralCode: string | null = null;

    if (data.role === "ORGANIZER" && data.referredByCode) {
      throw new AppError("Organizers cannot use a referral code", 400);
    }

    if (data.role === "CUSTOMER") {
      referralCode = await this.generateReferralCode(
        data.firstName + data.lastName
      );
      if (data.referredByCode) {
        referredBy = await this.getReferrerId(data.referredByCode);
      }
    }

    const hashedPassword = await this.hashPassword(data.password);
    const profilePicture = data.profilePicture || this.generateDefaultAvatar();

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

    if (referredBy && referralCode)
      await this.giveWelcomeCoupon(newUser.id, referralCode);

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

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken: token };
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
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError("User not found", 404);

    await prisma.user.update({
      where: { id: userId },
      data,
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

    const hashedPassword = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: "Password updated successfully" };
  }

  async sendPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 404);

    const resetToken = this.generateToken(
      { id: user.id, email: user.email },
      "15m"
    );

    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
    return { message: "Password reset email sent" };
  }

  async resetPassword(token: string, newPassword: string) {
    const decoded = this.verifyToken(token);
    const { id, email } = decoded as { id: number; email: string };

    const user = await prisma.user.findUnique({ where: { id, email } });
    if (!user) throw new AppError("User not found", 404);

    const hashedPassword = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { message: "Password updated successfully" };
  }

  private async generateReferralCode(name: string) {
    let code: string;
    let exists = true;

    while (exists) {
      code = `${name.toUpperCase().replace(/\s+/g, "").slice(0, 4)}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      const existing = await prisma.user.findUnique({
        where: { referralCode: code },
      });
      exists = !!existing;
    }

    return code!;
  }

  private async getReferrerId(referralCode: string) {
    const referrer = await prisma.user.findUnique({
      where: { referralCode },
    });

    if (!referrer) throw new AppError("Invalid referral code", 400);

    await prisma.point.create({
      data: {
        userId: referrer.id,
        pointsEarned: 10_000,
        description: "Referral bonus",
        balance: 10_000,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return referrer.id;
  }

  private async giveWelcomeCoupon(userId: number, referralCode: string) {
    await prisma.coupon.create({
      data: {
        userId,
        couponCode: `WELCOME-${referralCode}`,
        discountAmount: 10_000,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: "ACTIVE",
      },
    });
  }

  private generateDefaultAvatar(): string {
    const randomId = Math.floor(Math.random() * 10_000);
    return `https://github.com/identicons/${randomId}.png`;
  }

  private generateToken(payload: object, expiresIn: string = "1h"): string {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
      expiresIn: "1h",
    });
  }

  private verifyToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET_KEY as string);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
