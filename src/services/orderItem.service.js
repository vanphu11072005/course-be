import OrderItemRepository from "../repositories/orderItem.repository.js";

class OrderItemService {
  constructor() {
    this.repository = new OrderItemRepository();
  }

  // Lấy tất cả item của order
  getOrderItems(orderId) {
    return this.repository.getOrderItems(orderId);
  }

  // Lấy chi tiết item theo id
  getOrderItemById(id) {
    return this.repository.getOrderItemById(id);
  }

  // Thêm item mới vào order
  createOrderItem(orderId, data) {
    return this.repository.createOrderItem(orderId, data);
  }

  // Cập nhật item
  updateOrderItem(id, data) {
    return this.repository.updateOrderItem(id, data);
  }

  // Xóa item
  deleteOrderItem(id) {
    return this.repository.deleteOrderItem(id);
  }
}

export default OrderItemService;
