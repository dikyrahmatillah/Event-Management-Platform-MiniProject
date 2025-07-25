import { prisma } from "@/configs/prisma.config.js";
import { cloudinary } from "@/configs/cloudinary.config.js";
import { resend } from "@/configs/resend.config.js";
import fs from "node:fs/promises";
import bcrypt from "bcrypt";
import Handlebars from "handlebars";

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: "CUSTOMER" | "ORGANIZER";
  referralCode: string;
  profilePictureUrl?: string;
  referredBy: number | null;
  referredByCode?: string;
}
Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

export class AuthService {
  async isEmailExists(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return Boolean(user);
  }

  async hashPassword(password: string) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  async uploadPicture(filePath: string) {
    if (!filePath) throw new Error("No file path provided for upload");
    try {
      const uploadResult = await cloudinary.uploader.upload(filePath);
      return uploadResult.secure_url;
    } finally {
      await fs.unlink(filePath);
    }
  }

  async isReferredByCodeExists(
    referredByCode?: string
  ): Promise<number | null> {
    if (!referredByCode) return null;
    const referrerUser = await prisma.user.findUnique({
      where: { referralCode: referredByCode },
    });
    if (!referrerUser) {
      throw new Error("Invalid referral code");
    }
    return referrerUser.id;
  }

  async generateReferralCode(): Promise<string> {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const existingUser = await prisma.user.findUnique({
      where: { referralCode: code },
    });
    if (existingUser) {
      return this.generateReferralCode();
    }
    return code;
  }

  async sendWelcomeEmail(
    email: string,
    firstName: string,
    lastName: string,
    role: string
  ) {
    const template = await fs.readFile(
      "src/templates/emails/welcome.hbs",
      "utf-8"
    );
    const compiledTemplate = Handlebars.compile(template);
    const html = compiledTemplate({ firstName, lastName, role });

    await resend.emails.send({
      from: "Event Management Platform <onboarding@resend.dev>",
      to: email,
      subject: `Welcome to Event Management Platform, ${firstName}!`,
      html,
    });
  }

  async createUser(data: CreateUserData) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      role,
      referralCode,
      profilePictureUrl,
      referredBy,
    } = data;

    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        firstName,
        lastName,
        phone,
        profilePicture: profilePictureUrl,
        role,
        referralCode,
        referredBy,
      },
    });
    return newUser;
  }

  async registerUser({
    firstName,
    lastName,
    email,
    password,
    phone,
    role,
    referralCode,
    profilePictureUrl,
    referredByCode = "",
  }: CreateUserData) {
    const existingUser = await this.isEmailExists(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const referredBy = await this.isReferredByCodeExists(referredByCode);

    const hashedPassword = await this.hashPassword(password);

    // if (profilePictureUrl) {
    //   profilePictureUrl = await this.uploadPicture(profilePictureUrl);
    // } else {
    //   const randomIdenticonId = Math.floor(Math.random() * 100_000);
    //   profilePictureUrl = `https://github.com/identicons/${randomIdenticonId}.png`;
    // }

    const newUser = await this.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role,
      referralCode,
      profilePictureUrl,
      referredBy,
    });

    await this.sendWelcomeEmail(email, firstName, lastName, role);
    return {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role,
      profilePicture: newUser.profilePicture,
    };
  }
}
