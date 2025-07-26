import { NextFunction, Request, Response } from "express";
import { registerSchema, loginSchema } from "@/validations/auth.validation.js";
import { AuthService } from "@/services/auth.service.js";
import { FileService } from "@/services/file.service.js";
import { AppError } from "@/errors/app.error.js";

export class AuthController {
  async register(request: Request, response: Response, next: NextFunction) {
    try {
      const file = request.file;
      const data = registerSchema.parse(request.body);

      let profilePictureUrl: string | undefined;
      if (file) {
        profilePictureUrl = await new FileService().uploadPicture(file.path);
      }

      const authService = new AuthService();
      const user = await authService.registerUser({
        ...data,
        profilePictureUrl,
      });

      response
        .status(201)
        .json({ message: "User registered successfully", user });
    } catch (error) {
      next(error);
    }
  }

  async login(request: Request, response: Response, next: NextFunction) {
    try {
      const { email, password } = loginSchema.parse(request.body);
      const authService = new AuthService();
      const accessToken = await authService.loginUser(email, password);
      response.status(200).json({ message: "Login successful", accessToken });
    } catch (error) {
      next(error);
    }
  }

  async editProfile(request: Request, response: Response, next: NextFunction) {
    try {
      const file = request.file;
      if (!file) {
        throw new AppError("Profile picture is required", 400);
      }
      const profilePictureUrl = await new FileService().uploadPicture(
        file.path
      );
      const authService = new AuthService();

      const result = await authService.updateProfile(
        request.user.id,
        profilePictureUrl
      );
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { oldPassword, newPassword } = request.body;
      const authService = new AuthService();

      const result = await authService.changePassword(
        request.user.id,
        oldPassword,
        newPassword
      );
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { email } = request.body;
      const authService = new AuthService();

      const result = await authService.forgotPassword(email);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      const { token, newPassword } = request.body;
      const authService = new AuthService();

      const result = await authService.resetPassword(token, newPassword);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
