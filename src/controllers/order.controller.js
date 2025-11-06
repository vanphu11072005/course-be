import OrderService from "../services/order.service.js";
import BaseController from "./base.controller.js";

class OrderController extends BaseController {
  constructor() {
    super();
    this.service = new OrderService();
  }

  // 🔹 Lấy danh sách tất cả orders (admin)
  async getAllOrders(req, res) {
    const { 
      page = 1, 
      pageSize = 10, 
      search, 
      status, 
      paymentStatus,
      sortField, 
      sortOrder
    } = req.query;

    const result = await this.service.getListOrders({
      page,
      pageSize,
      search,
      status,
      paymentStatus,
      sortField, 
      sortOrder
    });

    res.json({
      status: true,
      message: "Fetched orders successfully",
      data: result.data,
      pagination: result.pagination,
    });
  }

  // 🔹 Lấy order theo ID
  async getOrderById(req, res) {
    const { id } = req.params;
    const order = await this.service.getOrderById(id);

    if (!order) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }

    res.json({
      status: true,
      message: "Fetched order successfully",
      data: order,
    });
  }

  // 🔹 Cập nhật order (admin)
  async updateOrder(req, res) {
    const { id } = req.params;
    const data = req.body;
    const updated = await this.service.updateOrder(id, data);
    
    data.userId = data.userId;
    
    if (!updated) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }

    res.json({
      status: true,
      message: "Order updated successfully",
      data: updated,
    });
  }

  // 🔹 Xóa order (admin)
  async deleteOrder(req, res) {
    const { id } = req.params;
    const deleted = await this.service.deleteOrder(id);

    if (!deleted) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }

    res.json({
      status: true,
      message: "Order deleted successfully",
    });
  }

  // 🔹 Lấy danh sách orders của 1 user (userId từ params)
  async getUserOrders(req, res) {
    const userId = req.params.userId;
    const orders = await this.service.getUserOrders(userId);

    res.json({
      status: true,
      message: "Fetched user orders successfully",
      data: orders,
    });
  }

  // 🔹 Lấy chi tiết 1 order của user (user dashboard)
  async getUserOrderDetail(req, res) {
    const userId = req.user.id;
    const { orderId } = req.params;
    const order = await this.service.getUserOrderDetail(userId, orderId);

    if (!order) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }

    res.json({
      status: true,
      message: "Fetched user order detail successfully",
      data: order,
    });
  }

  // 🔹 Thống kê orders của user (user dashboard)
  async getUserOrderStats(req, res) {
    const userId = req.user.id;
    const stats = await this.service.getUserOrderStats(userId);

    res.json({
      status: true,
      message: "Fetched user order stats successfully",
      data: stats,
    });
  }
}

export default new OrderController();