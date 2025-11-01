import express from "express";
import middlewares from "../middlewares/index.js";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);
router.get("/me", middlewares.auth, authController.getProfile);
router.get("/verify-email", authController.verifyEmail);

export default router;
