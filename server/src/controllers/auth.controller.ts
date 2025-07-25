import { NextFunction, Request, Response } from "express";
import { prisma } from "@/configs/prisma.config.js";
import { generateReferralCode } from "@/utils/generateReferralCode.js";
import { registerSchema } from "@/validations/auth.validation.js";
import { AuthService } from "@/services/auth.service.js";

export class AuthRegister {
  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const file = request.file;
      const {
        email,
        password,
        firstName,
        lastName = "",
        phone = "",
        role,
        referredByCode = "",
      } = registerSchema.parse(request.body);

      const referralCode = await generateReferralCode();

      let profilePictureUrl: string;
      if (file) {
        profilePictureUrl = await new AuthService().uploadPicture(file.path);
      } else {
        const randomIdenticonId = Math.floor(Math.random() * 10_000);
        profilePictureUrl = `https://github.com/identicons/${randomIdenticonId}.png`;
      }

      const authService = new AuthService();
      const user = await authService.registerUser({
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
        referralCode,
        profilePictureUrl,
        referredBy: null,
        referredByCode,
      });

      response
        .status(201)
        .json({ message: "User registered successfully", user });
    } catch (error) {
      next(error);
    }
  }
}

export async function getAllUsers(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const users = await prisma.user.findMany();
    response.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export const authController = new AuthRegister();
