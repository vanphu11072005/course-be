import { Router } from "express";

import authRoutes from "./auth.js";
import rolesRoutes from "./roles.js";
import usersRoutes from "./users.js";
// import profilesRoutes from './profiles.js';
import categoriesRoutes from "./categories.js";
import coursesRoutes from "./courses.js";
import lessonsRoutes from "./lessons.js";
import ordersRoutes from "./orders.js";
import orderItemsRoutes from "./orderItems.js";
import paymentsRoutes from "./payments.js";
import reviewsRoutes from './reviews.js';
import couponsRoutes from './coupons.js';
// import enrollmentsRoutes from './enrollments.js';
// import certificatesRoutes from './certificates.js';
import uploadsRoutes from "./uploads.js";

export default {
  v1: Router()
    .use("/auth", authRoutes)
    .use("/roles", rolesRoutes)
    .use("/users", usersRoutes)
    //   .use("/profiles", profilesRoutes)
    .use("/courses", coursesRoutes)
    // .use("/courses/:courseId/lessons", lessonsRoutes)
    // .use("/courses/:courseId/reviews", reviewsRoutes)
    .use("/lessons", lessonsRoutes)
    .use("/categories", categoriesRoutes)
    .use("/orders", ordersRoutes)
    .use("/reviews", reviewsRoutes)
    .use("/coupons", couponsRoutes)
    .use("/orderItem", orderItemsRoutes)
    .use("/payments", paymentsRoutes)
    .use("/uploads", uploadsRoutes)

    // Nested routes
    .use("/orders/:orderId/items", orderItemsRoutes),
  // .use('/courses/:courseId/lessons', lessonsRoutes)
};

// Các route còn lại
// router.use('/enrollments', enrollmentsRoutes);
// router.use('/certificates', certificatesRoutes);
