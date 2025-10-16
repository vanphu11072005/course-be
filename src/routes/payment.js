import express from "express";
import {
  createPayment,
  stripeWebhook,
} from "../controllers/payment.controller";

const router = express.Router();

// Tạo PaymentIntent
router.post("/create", createPayment);

// Webhook Stripe
// Lưu ý: webhook cần parse raw body
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

export default router;
