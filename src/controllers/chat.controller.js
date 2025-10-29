import dotenv from "dotenv";
import fetch from "node-fetch";
import CourseService from "../services/course.service.js"; // 🔥 import thêm service

dotenv.config();

// Tạo instance của CourseService
const courseService = new CourseService();

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    // 🔹 Lấy dữ liệu khóa học từ DB (10 khóa đầu tiên)
    const { data: courses } = await courseService.getListCourses({
      page: 1,
      pageSize: 10,
    });

    // 🔹 Chuyển thành dạng văn bản gọn gàng cho AI hiểu
    const courseListText = courses
      .map(
        (c) =>
          `• ${c.title} (${c.categoryId || "Chưa có danh mục"}) - ${
            c.description || "Không có mô tả"
          }`
      )
      .join("\n");

    // 🔹 Prompt cho hệ thống (system)
    const systemPrompt = `
    Bạn là chatbot hỗ trợ người dùng trên website WebCourse.
    Dưới đây là danh sách khóa học hiện có trên hệ thống:

    ${courseListText}

    Hãy sử dụng thông tin trên để tư vấn khi người dùng hỏi về khóa học.
    Nếu câu hỏi không liên quan đến khóa học, chỉ trả lời ngắn gọn và lịch sự.
`;

    // 🔹 Gọi API OpenRouter
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
          "X-Title": "WebCourse AI Chatbot",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
        }),
      }
    );

    const data = await response.json();

    // 🔹 Kiểm tra lỗi từ OpenRouter
    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res
        .status(response.status)
        .json({ error: data.message || "API error" });
    }

    const reply = data.choices?.[0]?.message?.content || 
      "Không có phản hồi.";
    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ 
      error: "Lỗi server hoặc kết nối OpenRouter thất bại." 
    });
  }
};

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
      const userId = chat.senderRole === "user" 
        ? chat.senderId 
        : chat.receiverId;
      
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
      error: "Không thể lấy lịch sử chat" 
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
        [db.Sequelize.Op.or]: [
          { senderId: userId },
          { receiverId: userId },
        ],
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
      error: "Không thể lấy lịch sử chat" 
    });
  }
};