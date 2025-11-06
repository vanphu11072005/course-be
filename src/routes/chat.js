import express from "express";
import ChatController from "../controllers/chat.controller.js";
import middlewares from "../middlewares/index.js";

const { auth, role } = middlewares;
const router = express.Router();

// Admin lấy tất cả lịch sử chat
router.get("/admin/history", auth, role("admin"), ChatController.getAdminChatHistory);

// User lấy lịch sử chat của mình
router.get("/user/history", auth, ChatController.getUserChatHistory);

export default router;
