import ChatService from "../services/chat.service.js";

const userSockets = new Map();
const userStatus = new Map();
const typingUsers = new Map();

const chatService = new ChatService();

export const initChatSocket = (io, db) => {
  io.on("connection", (socket) => {
    // ===== JOIN ROOM =====
    socket.on("join", ({ userId, role }) => {
      socket.userId = userId;
      socket.role = role;
      socket.join(userId);

      if (role === "user") {
        userSockets.set(userId, socket.id);
        userStatus.set(userId, { 
          online: true, 
          lastSeen: new Date() 
        });
        
        // Thông báo admin có user online
        io.to("admin01").emit("userOnline", { 
          userId, 
          online: true 
        });
      }

      console.log(`${role} ${userId} joined`);
    });

    // ===== SEND MESSAGE =====
    socket.on("sendMessage", async (data) => {
      const { senderId, receiverRole, targetUserId, text } = data;

      try {
        // Delegate DB write to service (single point of DB logic)
        await chatService.createMessage({
          senderId: senderId !== "admin01" ? senderId : null,
          senderRole: socket.role,
          receiverId: targetUserId !== "admin01" ? targetUserId : null,
          receiverRole,
          message: text,
        });

        // Gửi realtime
        const targetSocket = receiverRole === "admin" ? "admin01" : targetUserId;

        io.to(targetSocket).emit("receiveMessage", {
          senderId,
          text,
          timestamp: new Date(),
        });

        console.log(`📨 Message sent: ${senderId} → ${targetSocket}`);
      } catch (error) {
        console.error("❌ Error saving message via service:", error);
      }
    });

    // ===== TYPING INDICATOR =====
    socket.on("typing", ({ userId, isTyping }) => {
      const targetRoom = socket.role === "admin" 
        ? userId 
        : "admin01";

      if (isTyping) {
        // Xóa timeout cũ nếu có
        if (typingUsers.has(userId)) {
          clearTimeout(typingUsers.get(userId));
        }

        // Gửi typing event
        io.to(targetRoom).emit("userTyping", { 
          userId, 
          isTyping: true 
        });

        // Auto stop sau 3s
        const timeout = setTimeout(() => {
          io.to(targetRoom).emit("userTyping", { 
            userId, 
            isTyping: false 
          });
          typingUsers.delete(userId);
        }, 1000);

        typingUsers.set(userId, timeout);
      } else {
        // Stop typing ngay lập tức
        if (typingUsers.has(userId)) {
          clearTimeout(typingUsers.get(userId));
          typingUsers.delete(userId);
        }
        io.to(targetRoom).emit("userTyping", { 
          userId, 
          isTyping: false 
        });
      }
    });

    // ===== DISCONNECT =====
    socket.on("disconnect", () => {
      if (socket.role === "user" && socket.userId) {
        const userId = socket.userId;
        userSockets.delete(userId);
        
        const lastSeen = new Date();
        userStatus.set(userId, { 
          online: false, 
          lastSeen 
        });

        // Thông báo admin user offline
        io.to("admin01").emit("userOffline", { 
          userId, 
          online: false, 
          lastSeen 
        });
      }
    });
  });
};