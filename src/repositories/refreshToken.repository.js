import db from "../database/models/index.js";
import { v4 as uuidv4 } from "uuid";

class RefreshTokenRepository {
  constructor() {
    this.model = db.RefreshToken;
  }

  // Tạo refresh token mới
  async create({ userId, token, expiresAt }) {
    return this.model.create({ id: uuidv4(), userId, token, expiresAt });
  }

  // Tìm theo token
  async findByToken(token) {
    return this.model.findOne({ where: { token } });
  }

  // Xoá / thu hồi theo token
  async revokeByToken(token) {
    const item = await this.findByToken(token);
    if (!item) return false;
    await item.destroy();
    return true;
  }

  // Xoá tất cả token của 1 user (vd lúc logout)
  async revokeByUserId(userId) {
    return this.model.destroy({ where: { userId } });
  }

  // Xoá token expired
  async deleteExpired() {
    return this.model.destroy({ where: { expiresAt: { [db.Sequelize.Op.lt]: new Date() } } });
  }
}

export default RefreshTokenRepository;
