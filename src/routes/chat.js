import express from "express";
import {
  chatWithAI,
  getAdminChatHistory,
  getUserChatHistory,
} from "../controllers/chat.controller.js";
import middlewares from "../middlewares/index.js";

const { auth, role } = middlewares;
const router = express.Router();

router.post("/", chatWithAI);

// Admin lấy tất cả lịch sử chat
router.get("/admin/history", auth, role("admin"), getAdminChatHistory);

// User lấy lịch sử chat của mình
router.get("/user/history", auth, getUserChatHistory);

export default router;
