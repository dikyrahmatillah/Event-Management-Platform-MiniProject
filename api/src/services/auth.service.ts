import { prisma } from "@/configs/prisma.config.js";
import { AppError } from "@/errors/app.error.js";
import { EmailService } from "@/services/email.service.js";
import { ReferralService } from "./referral.service.js";
import {
  RegisterInput,
  UpdateProfileInput,
} from "@/validations/auth.validation.js";
import bcrypt from "bcrypt";
import { generateReferralCode } from "@/utils/generateReferralCode.js";
import { generateToken, verifyToken } from "@/utils/jwt.js";

export class AuthService {
  private emailService = new EmailService();
  private referralService = new ReferralService();

  async registerUser(data: RegisterInput) {
    if (await prisma.user.findUnique({ where: { email: data.email } })) {
      throw new AppError("Email already exists", 409);
    }

    if (data.role === "ORGANIZER" && data.referredByCode) {
      throw new AppError("Organizers cannot use a referral code", 400);
    }

    let referredBy: number | null = null;
    let referralCode: string | null = null;
    if (data.role === "CUSTOMER") {
      referralCode = await generateReferralCode(data.firstName + data.lastName);
      if (data.referredByCode) {
        referredBy = await this.referralService.getReferrerId(
          data.referredByCode
        );
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
      omit: { password: true },
    });

    if (referredBy && referralCode)
      await this.referralService.applyReferral(
        referralCode,
        newUser.id,
        referredBy
      );

    await this.emailService.sendWelcomeEmail(
      newUser.firstName,
      newUser.email,
      newUser.role
    );

    return newUser;
  }

  async loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = generateToken({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
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

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return updatedUser;
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
  }

  async sendPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("User not found", 404);

    const resetToken = generateToken({ id: user.id, email: user.email }, "15m");

    await this.emailService.sendPasswordResetEmail(user.email, resetToken);
  }

  async resetPassword(token: string, newPassword: string) {
    const decoded = verifyToken(token);
    const { id, email } = decoded as { id: number; email: string };

    const user = await prisma.user.findUnique({ where: { id, email } });
    if (!user) throw new AppError("User not found", 404);

    const hashedPassword = await this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  private generateDefaultAvatar() {
    const randomId = Math.floor(Math.random() * 10_000);
    return `https://github.com/identicons/${randomId}.png`;
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}
