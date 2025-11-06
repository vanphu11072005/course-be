import express from "express";
import middlewares from "../middlewares/index.js";
import dashboardController from "../controllers/dashboard.controller.js";

const router = express.Router();

// Lấy tổng quan dashboard
router.get(
  "/summary",
  middlewares.auth,
  middlewares.role("admin"),
  dashboardController.getSummary
);

// Doanh thu theo tháng
router.get(
  "/revenue",
  middlewares.auth,
  middlewares.role("admin"),
  dashboardController.getRevenueStats
);

// Top khóa học bán chạy
router.get(
  "/top-courses",
  middlewares.auth,
  middlewares.role("admin"),
  dashboardController.getTopCourses
);

// Đơn hàng gần đây
router.get(
  "/recent-orders",
  middlewares.auth,
  middlewares.role("admin"),
  dashboardController.getRecentOrders
);

// Đánh giá gần đây
router.get(
  "/recent-reviews",
  middlewares.auth,
  middlewares.role("admin"),
  dashboardController.getRecentReviews
);

router.get(
  "/monthly-new-users",
  middlewares.auth,
  middlewares.role("admin"),
  dashboardController.getMonthlyNewUsers
);

export default router;