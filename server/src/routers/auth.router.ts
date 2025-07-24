import { Router } from "express";
import { getAllUsers, register } from "@/controllers/auth.controller.js";
import { uploadProfilePicture } from "@/middleware/uploadProfilePicture.middleware.js";

const router = Router();
router.post(
  "/register",
  uploadProfilePicture.single("profilePicture"),
  register
);
router.get("/users", getAllUsers);

export default router;
