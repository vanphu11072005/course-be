import db from "../database/models/index.js";

class ChatRepository {
  constructor() {
    this.model = db.Chat;
    this.userModel = db.User;
    this.Sequelize = db.Sequelize;
  }

  // Lấy tất cả tin nhắn giữa user và admin (dùng cho admin)
  async getAllForAdmin() {
    return this.model.findAll({
      where: {
        senderRole: ["user", "admin"],
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: this.userModel,
          as: "sender",
          attributes: ["id", "name", "email"],
        },
      ],
    });
  }

  // Lấy lịch sử chat cho một user cụ thể
  async getByUserId(userId) {
    const { Op } = this.Sequelize;
    return this.model.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      order: [["createdAt", "ASC"]],
    });
  }

  // Tạo tin nhắn mới (dùng bởi socket hoặc service)
  async create(payload) {
    return this.model.create(payload);
  }
}

export default ChatRepository;
