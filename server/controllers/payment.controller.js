const stripe = require("../config/stripe");
const catchAsync = require("../utils/catchAsync");
const paymentService = require("../services/payment.service");

const createCheckoutSession = catchAsync(async (req, res) => {
  const url = await paymentService.createCheckoutSession(req.user, req.body);
  return res.status(201).json({ url });
});

const verifyPayment = catchAsync(async (req, res) => {
  const order = await paymentService.verifyPayment(
    req.user._id,
    req.params.orderId,
  );
  return res
    .status(200)
    .json({ message: "Payment status fetched successfully.", order });
});

const stripeWebhook = async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    console.log("[Stripe webhook] Signature verified.");
  } catch (err) {
    console.error(
      `[Stripe webhook] Signature verification failed: ${err.message}`,
    );
    return res.status(400).send("Invalid signature.");
  }

  console.log(`[Stripe webhook] Event received: ${event.type}`);

  try {
    await paymentService.handleWebhookEvent(event);
    return res.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook failed:", err);
    return res.status(500).json({ message: "Webhook handler failed." });
  }
};

module.exports = { createCheckoutSession, verifyPayment, stripeWebhook };
