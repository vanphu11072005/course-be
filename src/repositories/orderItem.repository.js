import db from "../database/models/index.js";
import { v4 as uuidv4 } from "uuid";

class OrderItemRepository {
  constructor() {
    this.model = db.OrderItem;
    this.courseModel = db.Course;
  }

  // 🔹 Lấy tất cả item theo orderId
  async getOrderItems(orderId) {
    return this.model.findAll({
      where: { orderId },
      include: [{ model: this.courseModel, as: "course" }],
    });
  }

  // 🔹 Lấy chi tiết item theo id
  async getOrderItemById(itemId) {
    return this.model.findByPk(itemId, {
      include: [{ model: this.courseModel, as: "course" }],
    });
  }

  // 🔹 Thêm item vào order
  async createOrderItem(orderId, itemData) {
    return this.model.create({
      id: uuidv4(),
      orderId,
      courseId: itemData.courseId,
      price: itemData.price,
      discount: itemData.discount || 0,
      finalPrice: itemData.finalPrice || itemData.price,
      accessStatus: itemData.accessStatus || "active",
    });
  }

  // 🔹 Cập nhật item
  async updateOrderItem(itemId, data) {
    const item = await this.model.findByPk(itemId);
    if (!item) return null;
    await item.update(data);
    return this.getOrderItemById(itemId);
  }

  // 🔹 Xóa item
  async deleteOrderItem(itemId) {
    const item = await this.model.findByPk(itemId);
    if (!item) return false;
    await item.destroy();
    return true;
  }
}

export default OrderItemRepository;
