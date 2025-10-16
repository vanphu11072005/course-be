import express from "express";
import {
  purchaseCourse,
  stripeWebhook,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Body parser cho webhook phải raw
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);
router.post("/create-payment-intent", purchaseCourse);

export default router;
