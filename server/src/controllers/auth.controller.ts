import { NextFunction, Request, Response } from "express";
import { prisma } from "@/configs/prisma.config.js";
import { generateReferralCode } from "@/utils/generateReferralCode.js";
import cloudinary from "@/configs/cloudinary.config.js";
import fs from "node:fs/promises";
import { registerSchema } from "@/validations/auth.validation.js";
import { hash } from "bcrypt";

export async function register(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const file = request.file;
    const {
      email,
      password,
      firstName,
      lastName = "",
      phone,
      role,
      referredByCode,
    } = registerSchema.parse(request.body);

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return response.status(409).json({ message: "Email already exists" });
    }

    // Find referrer by referral code if provided
    let referredById;
    if (referredByCode) {
      const referrer = await prisma.user.findUnique({
        where: { referralCode: referredByCode },
      });
      if (referrer) {
        referredById = referrer.id;
      }
    }

    // Handle profile picture upload or assign identicon
    let profilePictureUrl;
    if (file) {
      try {
        const uploadResult = await cloudinary.uploader.upload(file.path);
        profilePictureUrl = uploadResult.secure_url;
      } finally {
        await fs.unlink(file.path); // Always clean up local file
      }
    } else {
      const randomIdenticonId = Math.floor(Math.random() * 100_000);
      profilePictureUrl = `https://github.com/identicons/${randomIdenticonId}.png`;
    }

    // Generate referral code
    const referralCode = await generateReferralCode();

    // Hash password before saving
    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        profilePicture: profilePictureUrl,
        role,
        referralCode: referralCode,
        referredBy: referredById,
      },
    });

    response.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
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
