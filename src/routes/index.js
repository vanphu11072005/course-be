import { Router } from "express";

import settingRoutes from "./setting.js";
import searchRoutes from "./search.js";
import authRoutes from "./auth.js";
import rolesRoutes from "./roles.js";
import usersRoutes from "./users.js";
import dashboardRoutes from "./dashboard.js";
import categoriesRoutes from "./categories.js";
import coursesRoutes from "./courses.js";
import lessonsRoutes from "./lessons.js";
import ordersRoutes from "./orders.js";
import orderItemsRoutes from "./orderItems.js";
import paymentsRoutes from "./payments.js";
import reviewsRoutes from "./reviews.js";
import couponsRoutes from "./coupons.js";
import profilesRoutes from "./profile.js";
import chatCourses from "./chat.js";
import uploadsRoutes from "./uploads.js";

export default {
  v1: Router()
    .use("/settings", settingRoutes)
    .use("/admin/search", searchRoutes)
    .use("/auth", authRoutes)
    .use("/roles", rolesRoutes)
    .use("/users", usersRoutes)
    .use("/profiles", profilesRoutes)
    .use("/dashboard", dashboardRoutes)
    .use("/courses", coursesRoutes)
    .use("/chat", chatCourses)
    .use("/lessons", lessonsRoutes)
    .use("/categories", categoriesRoutes)
    .use("/orders", ordersRoutes)
    .use("/reviews", reviewsRoutes)
    .use("/coupons", couponsRoutes)
    .use("/orderItem", orderItemsRoutes)
    .use("/payments", paymentsRoutes)
    .use("/uploads", uploadsRoutes)
    .use("/orders/:orderId/items", orderItemsRoutes),
};

