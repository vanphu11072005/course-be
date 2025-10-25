import db from "../database/models/index.js";
import { Sequelize } from "sequelize";

class DashboardRepository {
  constructor() {
    this.orderModel = db.Order;
    this.orderItemModel = db.OrderItem;
    this.courseModel = db.Course;
    this.userModel = db.User;
    this.reviewModel = db.Review;
    this.paymentModel = db.Payment;
    this.roleModel = db.Role;
  }

  // 1️⃣ Tổng quan hệ thống
  async getSummary() {
    const totalRevenue = await this.paymentModel.sum("amount", {
      where: { status: "success" }, // sửa từ 'paid' → 'success'
    });

    const totalOrders = await this.orderModel.count({
      where: { paymentStatus: "paid" }, // giữ nguyên vì Order.paymentStatus = 'paid'
    });

    const totalUsers = await this.userModel.count({
      include: [
        {
          model: this.roleModel,
          as: "role",
          where: { name: "student" },
        },
      ],
    });

    const totalCourses = await this.courseModel.count();

    return {
      totalUsers,
      totalCourses,
      totalOrders,
      totalRevenue: totalRevenue || 0,
    };
  }

  // 2️⃣ Doanh thu theo tháng (6 tháng gần nhất)
  async getRevenueStats() {
    const result = await this.paymentModel.findAll({
      attributes: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("createdAt"), "%Y-%m"),
          "month",
        ],
        [Sequelize.fn("SUM", Sequelize.col("amount")), "totalRevenue"],
      ],
      where: { status: "success" }, // sửa từ 'paid' → 'success'
      group: ["month"],
      order: [[Sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    console.log("Backend revenue stats:", result);

    return result.map((r) => ({
      month: r.month,
      totalRevenue: parseFloat(r.totalRevenue),
    }));
  }

  // 6️⃣ Số lượng học viên đăng ký theo tháng (toàn bộ, không giới hạn)
  async getMonthlyNewUsers() {
    const result = await this.userModel.findAll({
      attributes: [
        [
          Sequelize.fn("DATE_FORMAT", Sequelize.col("User.createdAt"), "%Y-%m"),
          "month",
        ],
        [Sequelize.fn("COUNT", Sequelize.col("User.id")), "totalUsers"],
      ],
      include: [
        {
          model: this.roleModel,
          as: "role",
          where: { name: "student" },
          attributes: [],
        },
      ],
      group: ["month"],
      order: [[Sequelize.literal("month"), "ASC"]],
      raw: true,
    });

    console.log("Backend new users stats:", result);

    return result.map((r) => ({
      month: r.month,
      totalUsers: parseInt(r.totalUsers, 10),
    }));
  }

  // 3️⃣ Top khóa học bán chạy
  async getTopCourses(limit = 5) {
    const result = await this.orderItemModel.findAll({
      attributes: [
        "courseId",
        [Sequelize.fn("COUNT", Sequelize.col("courseId")), "salesCount"],
      ],
      include: [
        {
          model: this.courseModel,
          as: "course",
          attributes: ["id", "title", "price", "thumbnailUrl"],
        },
      ],
      group: ["courseId", "course.id"],
      order: [[Sequelize.literal("salesCount"), "DESC"]],
      limit,
      raw: true,
      nest: true,
    });

    return result.map((r) => ({
      id: r.course.id,
      title: r.course.title,
      price: r.course.price,
      thumbnailUrl: r.course.thumbnailUrl,
      salesCount: r.salesCount,
    }));
  }

  // 4️⃣ Đơn hàng gần đây
  async getRecentOrders(limit = 5) {
    const result = await this.orderModel.findAll({
      limit,
      order: [["createdAt", "DESC"]],
      where: { paymentStatus: "paid" },
      include: [
        {
          model: this.userModel,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      attributes: ["id", "totalAmount", "status", "createdAt"],
    });

    return result.map((order) => ({
      id: order.id,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      user: order.user,
    }));
  }

  // 5️⃣ Đánh giá gần đây
  async getRecentReviews(limit = 5) {
    const result = await this.reviewModel.findAll({
      limit,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: this.userModel,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: this.courseModel,
          as: "course",
          attributes: ["id", "title"],
        },
      ],
      attributes: ["id", "rating", "comment", "createdAt"],
    });

    return result.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      user: review.user,
      course: review.course,
    }));
  }
}

export default DashboardRepository;
