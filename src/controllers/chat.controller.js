// ===== LẤY LỊCH SỬ CHAT (Admin) =====
export const getAdminChatHistory = async (req, res) => {
  try {
    const db = req.app.get("db");

    // Lấy tất cả tin nhắn giữa user và admin
    const chats = await db.Chat.findAll({
      where: {
        senderRole: ["user", "admin"],
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: db.User,
          as: "sender",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // Group theo userId
    const grouped = {};
    chats.forEach((chat) => {
      const userId =
        chat.senderRole === "user" ? chat.senderId : chat.receiverId;

      if (!grouped[userId]) {
        grouped[userId] = [];
      }

      grouped[userId].push({
        sender: chat.senderRole,
        text: chat.message,
        timestamp: chat.createdAt,
        isRead: chat.isRead,
        userName: chat.sender?.name || "Unknown",
      });
    });

    res.json({ chats: grouped });
  } catch (error) {
    console.error("❌ Error fetching chat history:", error);
    res.status(500).json({
      error: "Không thể lấy lịch sử chat",
    });
  }
};

// ===== LẤY LỊCH SỬ CHAT (User) =====
export const getUserChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const db = req.app.get("db");

    const chats = await db.Chat.findAll({
      where: {
        [db.Sequelize.Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      order: [["createdAt", "ASC"]],
    });

    const messages = chats.map((chat) => ({
      sender: chat.senderRole,
      text: chat.message,
      timestamp: chat.createdAt,
    }));

    res.json({ messages });
  } catch (error) {
    console.error("❌ Error fetching user chat:", error);
    res.status(500).json({
      error: "Không thể lấy lịch sử chat",
    });
  }
};
