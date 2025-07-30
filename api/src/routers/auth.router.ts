import { Router } from "express";
import { authController } from "@/controllers/auth.controller.js";
import { upload } from "@/middlewares/upload.middleware.js";
import { verifyToken } from "@/middlewares/verifyToken.middleware.js";

const router = Router();
router.post(
  "/register",
  upload.single("profilePicture"),
  authController.register
);
router.post("/login", authController.login);
router.get("/profile/:id", authController.getPublicProfile);
router.get("/profile", verifyToken, authController.getUserProfile);
router.put(
  "/edit-profile",
  verifyToken,
  upload.single("profilePicture"),
  authController.editProfile
);
router.put("/change-password", verifyToken, authController.changePassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
