import db from "../database/models/index.js";
import { Op, Sequelize } from "sequelize";

class OrderRepository {
  constructor() {
    this.model = db.Order;
    this.userModel = db.User;
    this.itemModel = db.OrderItem;
    this.courseModel = db.Course;
  }

  // 🔹 Lấy tất cả đơn hàng (admin hoặc lọc theo userId)
  async getAllOrders({
    page = 1,
    pageSize = 10,
    search,
    paymentStatus,
    sortField = "createdAt",
    sortOrder = "desc",
  }) {
    const orderDir = sortOrder.toLowerCase() === "asc" ? "ASC" : "DESC";
    const where = {};
    if (paymentStatus) where.paymentStatus = paymentStatus;

    // 🔍 Tìm kiếm theo id hoặc tên user
    if (search) {
      where[Op.or] = [
        { "$user.name$": { [Op.like]: `%${search}%` } },
      ];
    }


    // 🧩 Xử lý sắp xếp
    const orderArray = [];

    // Sort trực tiếp các cột thuộc bảng Order
    const directColumns = [
      "totalAmount",
      "status",
      "paymentStatus",
      "createdAt",
    ];

    if (directColumns.includes(sortField)) {
      orderArray.push([sortField, orderDir]);
    }
    // Sort theo tên user
    else if (sortField === "user") {
      orderArray.push([{ model: this.userModel, as: "user" }, "name", orderDir]);
    } 
    // Mặc định sort theo ngày tạo
    else {
      orderArray.push(["createdAt", "DESC"]);
    }

    // ⚙️ Truy vấn dữ liệu
    const { count, rows } = await this.model.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: +pageSize,
      distinct: true,
      order: orderArray,
      include: [
        {
          model: this.userModel,
          as: "user",
          attributes: ["id", "name", "email"],
        },
        {
          model: this.itemModel,
          as: "items",
          include: [
            {
              model: this.courseModel,
              as: "course",
              attributes: ["id", "title", "price", "thumbnailUrl"],
            },
          ],
        },
      ],
    });

    return {
      data: rows,
      pagination: {
        total: typeof count === "number" ? count : count.length,
        page: +page,
        pageSize: +pageSize,
        totalPages: Math.ceil(
          (typeof count === "number" ? count : count.length) / pageSize
        ),
      },
    };
  }

  // 🔹 Lấy 1 order theo id
  async getOrderById(id) {
    return this.model.findByPk(id, {
      include: [
        { model: this.userModel, as: "user", attributes: ["id", "name", "email"] },
        {
          model: this.itemModel,
          as: "items",
          include: [
            {
              model: this.courseModel,
              as: "course",
              attributes: ["id", "title", "price", "thumbnailUrl"],
            },
          ],
        },
      ],
    });
  }

  // 🔹 Lấy danh sách order của user
  async getUserOrders(userId) {
    return this.model.findAll({
      where: { userId, paymentStatus: "paid" },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: this.itemModel,
          as: "items",
          include: [
            {
              model: this.courseModel,
              as: "course",
              attributes: ["id", "title", "price", "thumbnailUrl"],
            },
          ],
        },
      ],
    });
  }

  // 🔹 Cập nhật order
  async updateOrder(id, data) {
    const order = await this.model.findByPk(id);
    if (!order) return null;

    if (order.paymentStatus !== "paid") {
      await order.update({
        userId: data.userId ?? order.userId,
        couponId: data.couponId ?? order.couponId,
        note: data.note ?? order.note,
      });
    } else {
      await order.update({
        userId: data.userId ?? order.userId,
        couponId: data.couponId ?? order.couponId,
        totalAmount: data.totalAmount ?? order.totalAmount,
        status: data.status ?? order.status,
        paymentMethod: data.paymentMethod ?? order.paymentMethod,
        paymentStatus: data.paymentStatus ?? order.paymentStatus,
        note: data.note ?? order.note,
      });
    }

    return order;
  }

  // 🔹 Xóa order
  async deleteOrder(id) {
    const order = await this.model.findByPk(id);
    if (!order) return false;
    await order.destroy();
    return true;
  }
}

export default OrderRepository;
