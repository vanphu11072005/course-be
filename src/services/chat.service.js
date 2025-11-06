import ChatRepository from "../repositories/chat.repository.js";

class ChatService {
  constructor() {
    this.repository = new ChatRepository();
  }

  // Trả về lịch sử chat grouped theo userId cho admin
  async getAdminChatHistory() {
    const chats = await this.repository.getAllForAdmin();

    const grouped = {};
    chats.forEach((chat) => {
      const userId = chat.senderRole === "user" ? chat.senderId : chat.receiverId;

      if (!grouped[userId]) grouped[userId] = [];

      grouped[userId].push({
        sender: chat.senderRole,
        text: chat.message,
        timestamp: chat.createdAt,
        isRead: chat.isRead,
        userName: chat.sender?.name || "Unknown",
      });
    });

    return grouped;
  }

  // Trả về lịch sử chat của user
  async getUserChatHistory(userId) {
    const chats = await this.repository.getByUserId(userId);

    return chats.map((chat) => ({
      sender: chat.senderRole,
      text: chat.message,
      timestamp: chat.createdAt,
    }));
  }

  // Tạo tin nhắn (tiện cho socket handler khi cần dùng service)
  async createMessage(data) {
    return this.repository.create(data);
  }
}

export default ChatService;
