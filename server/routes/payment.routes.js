const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  createCheckoutSession,
  verifyPayment,
} = require("../controllers/payment.controller");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { createOrderSchema } = require("../validations/order.validation");
const {
  verifyPaymentParamsSchema,
} = require("../validations/payment.validation");

const router = express.Router();

const checkoutLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Try again in a minute." },
});

router.post(
  "/checkout-session",
  protect,
  checkoutLimiter,
  validate(createOrderSchema),
  createCheckoutSession,
);

router.get(
  "/verify/:orderId",
  protect,
  validate(verifyPaymentParamsSchema, "params"),
  verifyPayment,
);

module.exports = router;
