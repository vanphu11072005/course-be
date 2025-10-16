import OrderRepository from "../repositories/order.repository.js";

class OrderService {
  constructor() {
    this.repository = new OrderRepository();
  }

  // Admin: lấy tất cả orders
  getListOrders({ page, pageSize, search, paymentStatus, userId, sortField, sortOrder }) {
    return this.repository.getAllOrders({ page, pageSize, search, paymentStatus, userId, sortField, sortOrder });
  }

  getOrderById(id) {
    return this.repository.getOrderById(id);
  }

  createOrder(data) {
    return this.repository.createOrder(data);
  }

  updateOrder(id, data) {
    return this.repository.updateOrder(id, data);
  }

  deleteOrder(id) {
    return this.repository.deleteOrder(id);
  }

  // User: lấy danh sách orders của mình
  getUserOrders(userId) {
    return this.repository.getUserOrders(userId);
  }
}

export default OrderService;
