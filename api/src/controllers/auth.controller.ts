import { NextFunction, Request, Response } from "express";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/validations/auth.validation.js";
import { AuthService } from "@/services/auth.service.js";
import { FileService } from "@/services/file.service.js";

export class AuthController {
  private authService = new AuthService();
  private fileService = new FileService();

  register = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const file = request.file;
      const profilePictureUrl = file
        ? await this.fileService.uploadPicture(file.path)
        : undefined;

      const data = registerSchema.parse({
        ...request.body,
        profilePicture: profilePictureUrl,
      });

      const user = await this.authService.registerUser(data);

      response
        .status(201)
<<<<<<< HEAD
<<<<<<< HEAD
        .json({ message: "User registered successfully", user });
=======
        .json({ message: "User registered successfully", data: user });
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
=======
        .json({ message: "User registered successfully", data: user });
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  };

  login = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { email, password } = loginSchema.parse(request.body);
      const accessToken = await this.authService.loginUser(email, password);
<<<<<<< HEAD
<<<<<<< HEAD
      response.status(200).json({ message: "Login successful", accessToken });
=======
      response
        .status(200)
        .json({ message: "Login successful", data: { accessToken } });
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
=======
      response
        .status(200)
        .json({ message: "Login successful", data: { accessToken } });
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  };

  getPublicProfile = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = Number(request.params.id);
      const userProfile = await this.authService.getPublicProfile(userId);
<<<<<<< HEAD
<<<<<<< HEAD
      response.status(200).json(userProfile);
=======
      response.status(200).json({ data: userProfile });
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
=======
      response.status(200).json({ data: userProfile });
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  };

  getUserProfile = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const userId = request.user.id;
      const userProfile = await this.authService.getUserProfile(userId);
<<<<<<< HEAD
<<<<<<< HEAD
      response.status(200).json(userProfile);
=======
      response.status(200).json({ data: userProfile });
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
=======
      response.status(200).json({ data: userProfile });
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  };

  editProfile = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const profilePictureUrl = request.file
        ? await this.fileService.uploadPicture(request.file.path)
        : undefined;

      const data = updateProfileSchema.parse({
        ...request.body,
        profilePictureUrl,
      });

      const result = await this.authService.updateProfile(
        request.user.id,
        data
      );
<<<<<<< HEAD
<<<<<<< HEAD
      response.status(200).json(result);
=======
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
      response.status(200).json({
        message: "Profile updated successfully",
        data: result,
      });
<<<<<<< HEAD
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { oldPassword, newPassword } = changePasswordSchema.parse(
        request.body
      );
      const result = await this.authService.changePassword(
        request.user.id,
        oldPassword,
        newPassword
      );
<<<<<<< HEAD
<<<<<<< HEAD
      response.status(200).json(result);
=======
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
      response.status(200).json({
        message: "Password changed successfully",
        data: result,
      });
<<<<<<< HEAD
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { email } = forgotPasswordSchema.parse(request.body);
      const result = await this.authService.sendPasswordReset(email);
<<<<<<< HEAD
<<<<<<< HEAD
      response.status(200).json(result);
=======
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
      response.status(200).json({
        message: "Password reset email sent successfully",
        data: result,
      });
<<<<<<< HEAD
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(request.body);
      const result = await this.authService.resetPassword(token, newPassword);
<<<<<<< HEAD
<<<<<<< HEAD
      response.status(200).json(result);
=======
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
      response.status(200).json({
        message: "Password reset successfully",
        data: result,
      });
<<<<<<< HEAD
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
=======
>>>>>>> 17eb489d69d6a62e957f4084671f38a02fef9139
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
