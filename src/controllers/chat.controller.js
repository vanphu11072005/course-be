import BaseController from "./base.controller.js";
import ChatService from "../services/chat.service.js";

class ChatController extends BaseController {
  constructor() {
    super();
    this.service = new ChatService();
  }

  // Admin lấy lịch sử chat grouped theo user
  async getAdminChatHistory(req, res) {
    try {
      const grouped = await this.service.getAdminChatHistory();
      res.json({ chats: grouped });
    } catch (error) {
      console.error("❌ Error fetching chat history:", error);
      res.status(500).json({ error: "Không thể lấy lịch sử chat" });
    }
  }

  // User lấy lịch sử chat của mình
  async getUserChatHistory(req, res) {
    try {
      const userId = req.user.id;
      const messages = await this.service.getUserChatHistory(userId);
      res.json({ messages });
    } catch (error) {
      console.error("❌ Error fetching user chat:", error);
      res.status(500).json({ error: "Không thể lấy lịch sử chat" });
    }
  }
}

export default new ChatController();
