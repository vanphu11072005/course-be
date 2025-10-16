import OrderItemService from "../services/orderItem.service.js";
import BaseController from "./base.controller.js";

class OrderItemController extends BaseController {
  constructor() {
    super();
    this.service = new OrderItemService();
  }

  // 🔹 Lấy danh sách item trong 1 order
  async getOrderItems(req, res) {
    const { orderId } = req.params;
    const items = await this.service.getOrderItems(orderId);
    res.json({
      status: true,
      message: "Fetched order items successfully",
      data: items,
    });
  }

  // 🔹 Lấy item theo ID
  async getOrderItemById(req, res) {
    const { id } = req.params;
    const item = await this.service.getOrderItemById(id);
    if (!item) {
      return res.status(404).json({ status: false, message: "Order item not found" });
    }
    res.json({
      status: true,
      message: "Fetched order item successfully",
      data: item,
    });
  }

  // 🔹 Thêm item vào order
  async createOrderItem(req, res) {
    const { orderId } = req.params;
    const data = req.body;
    const newItem = await this.service.createOrderItem(orderId, data);
    res.status(201).json({
      status: true,
      message: "Order item created successfully",
      data: newItem,
    });
  }

  // 🔹 Cập nhật item
  async updateOrderItem(req, res) {
    const { id } = req.params;
    const data = req.body;
    const updated = await this.service.updateOrderItem(id, data);

    if (!updated) {
      return res.status(404).json({ status: false, message: "Order item not found" });
    }

    res.json({
      status: true,
      message: "Order item updated successfully",
      data: updated,
    });
  }

  // 🔹 Xóa item
  async deleteOrderItem(req, res) {
    const { id } = req.params;
    const deleted = await this.service.deleteOrderItem(id);

    if (!deleted) {
      return res.status(404).json({ status: false, message: "Order item not found" });
    }

    res.json({
      status: true,
      message: "Order item deleted successfully",
    });
  }
}

export default new OrderItemController();
