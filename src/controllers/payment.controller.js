import Stripe from "stripe";
import db from "../database/models/index.js";
// import Payment from "../database/models/payment.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-09-30.clover",
});

export const purchaseCourse = async (req, res) => {
  const { courseId, userId } = req.body;

  if (!courseId || !userId) {
    return res.status(400).json({ error: "courseId and userId are required" });
  }

  try {
    // 1️⃣ Lấy thông tin khóa học (giá)
    const course = await db.Course.findByPk(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // 2️⃣ Tạo Order
    const order = await db.Order.create({
      userId,
      totalAmount: course.price,
      status: "pending",
      paymentStatus: "unpaid",
    });

    // 3️⃣ Tạo OrderItem liên quan đến order
    await db.OrderItem.create({
      orderId: order.id,
      courseId: course.id,
      price: course.price,
      discount: 0,
      finalPrice: course.price,
      accessStatus: "active",
    });

    // 4️⃣ Tạo PaymentIntent trên Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 10), // cents
      currency: "usd",
      metadata: { orderId: order.id, courseId: course.id },
    });

    // 5️⃣ Tạo Payment record trong DB
    await db.Payment.create({
      orderId: order.id,
      paymentMethod: "stripe",
      transactionId: paymentIntent.id,
      amount: course.price,
      status: "pending",
      meta: paymentIntent,
    });

    res.json({ clientSecret: paymentIntent.client_secret, orderId: order.id });
  } catch (err) {
    console.error(err);
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
      await db.Payment.update(
        { status: "succeeded", paidAt: new Date() },
        { where: { transactionId: paymentIntent.id } }
      );
    }
    res.json({ received: true });
  } catch (error) {
    console.log(error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
