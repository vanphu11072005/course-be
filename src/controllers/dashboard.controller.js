import DashboardService from "../services/dashboard.service.js";
import BaseController from "./base.controller.js";

class DashboardController extends BaseController {
  constructor() {
    super();
    this.service = new DashboardService();
  }

  // 1️⃣ Tổng quan
  async getSummary(req, res) {
    const data = await this.service.getSummary();

    res.json({
      status: true,
      message: "Fetched dashboard summary successfully",
      data,
    });
  }

  // 2️⃣ Thống kê doanh thu
  async getRevenueStats(req, res) {
    const data = await this.service.getRevenueStats();

    res.json({
      status: true,
      message: "Fetched revenue stats successfully",
      data,
    });
  }

  async getMonthlyNewUsers(req, res) {
    try {
      const lastMonths = +req.query.lastMonths || 6;
      console.log("📌 Controller: lastMonths =", lastMonths);

      const data = await this.service.getMonthlyNewUsers(lastMonths);
      console.log("📌 Controller: data fetched =", data);

      res.json({
        status: true,
        message: "Fetched monthly new users successfully",
        data,
      });
    } catch (error) {
      console.error("❌ getMonthlyNewUsers ERROR (Controller):", error);
      res.status(500).json({
        status: false,
        message: "Server error while fetching monthly new users",
      });
    }
  }

  // 3️⃣ Top khóa học
  async getTopCourses(req, res) {
    const limit = +req.query.limit || 5;
    const data = await this.service.getTopCourses(limit);

    res.json({
      status: true,
      message: "Fetched top courses successfully",
      data,
    });
  }

  // 4️⃣ Đơn hàng gần đây
  async getRecentOrders(req, res) {
    const limit = +req.query.limit || 5;
    const data = await this.service.getRecentOrders(limit);

    res.json({
      status: true,
      message: "Fetched recent orders successfully",
      data,
    });
  }

  // 5️⃣ Đánh giá gần đây
  async getRecentReviews(req, res) {
    const limit = +req.query.limit || 5;
    const data = await this.service.getRecentReviews(limit);

    res.json({
      status: true,
      message: "Fetched recent reviews successfully",
      data,
    });
  }
}

export default new DashboardController();
