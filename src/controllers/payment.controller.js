import Stripe from "stripe";
import db from "../database/models/index.js";
import { Op } from "sequelize";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

export const purchaseCourse = async (req, res) => {
  let { courseId, courseIds, userId } = req.body;

  // 🧠 Cho phép cả 2 kiểu: courseId hoặc courseIds[]
  if (!userId || (!courseId && (!courseIds || !courseIds.length))) {
    return res
      .status(400)
      .json({ error: "courseId or courseIds[] + userId required" });
  }

  // Nếu chỉ có 1 courseId, convert thành mảng để xử lý chung
  if (courseId && !courseIds) {
    courseIds = [courseId];
  }

  try {
    // 1️⃣ Lấy danh sách khóa học
    const courses = await db.Course.findAll({
      where: { id: { [Op.in]: courseIds } },
    });

    if (!courses.length) {
      return res.status(404).json({ error: "No valid courses found" });
    }

    // 2️⃣ Tính tổng giá
    const totalAmount = courses.reduce((sum, c) => sum + Number(c.price), 0);
    // 3️⃣ Tạo Order
    const order = await db.Order.create({
      userId,
      totalAmount,
      status: "pending",
      paymentStatus: "unpaid",
    });

    // 4️⃣ Tạo OrderItems
    for (const course of courses) {
      await db.OrderItem.create({
        orderId: order.id,
        courseId: course.id,
        price: course.price,
        discount: 0,
        finalPrice: course.price,
        accessStatus: "revoked",
      });
    }

    // 5️⃣ Tạo PaymentIntent trên Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 10),
      currency: "usd",
      metadata: {
        orderId: order.id,
        courseIds: courseIds.join(","),
      },
    });

    // 6️⃣ Tạo Payment record trong DB
    await db.Payment.create({
      orderId: order.id,
      paymentMethod: "bank",
      transactionId: paymentIntent.id,
      amount: totalAmount,
      status: "pending",
      meta: paymentIntent,
    });

    res.json({ clientSecret: paymentIntent.client_secret, orderId: order.id });
  } catch (err) {
    console.error("💥 purchaseCourse error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const { orderId, courseIds } = paymentIntent.metadata;
      const courseIdArray = courseIds?.split(",") || [];

      // ✅ Cập nhật Payment
      await db.Payment.update(
        { status: "success", paidAt: new Date() },
        { where: { transactionId: paymentIntent.id } }
      );

      // ✅ Cập nhật Order
      await db.Order.update(
        { status: "paid", paymentStatus: "paid" },
        { where: { id: orderId } }
      );

      // ✅ Cập nhật tất cả OrderItem sang active
      await db.OrderItem.update(
        { accessStatus: "active" },
        { where: { orderId, courseId: { [Op.in]: courseIdArray } } }
      );

      console.log(`✅ Đã cấp quyền truy cập cho order #${orderId}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error("💥 Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
