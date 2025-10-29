const userSockets = new Map(); // { userId: socketId }
const userStatus = new Map();  // { userId: { online, lastSeen } }
const typingUsers = new Map(); // { userId: timeoutId }

export const initChatSocket = (io, db) => {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

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
      const { 
        senderId, 
        receiverRole, 
        targetUserId, 
        text 
      } = data;

      try {
        // Lưu tin nhắn vào DB
        await db.Chat.create({
          senderId: senderId !== "admin01" ? senderId : null,
          senderRole: socket.role,
          receiverId: targetUserId !== "admin01" ? 
            targetUserId : null,
          receiverRole,
          message: text,
          isRead: false,
        });

        // Gửi realtime
        const targetSocket = receiverRole === "admin" 
          ? "admin01" 
          : targetUserId;
        
        io.to(targetSocket).emit("receiveMessage", {
          senderId,
          text,
          timestamp: new Date(),
        });

        console.log(`📨 Message sent: ${senderId} → ${targetSocket}`);
      } catch (error) {
        console.error("❌ Error saving message:", error);
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
        }, 3000);

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

        console.log(`🔴 User ${userId} offline`);
      }
    });
  });
};