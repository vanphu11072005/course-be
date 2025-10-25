import express from "express";
import middlewares from "../middlewares/index.js";
import authController from "../controllers/auth.controller.js";
import UserValidator from "../validators/user.validator.js";

const router = express.Router();
const validator = new UserValidator();

router.post("/register", validator.registerSchema(), authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/refresh", authController.refreshToken);
router.get("/me", middlewares.auth, authController.getProfile);
router.get("/verify-email", authController.verifyEmail);

export default router;
