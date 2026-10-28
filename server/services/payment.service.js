const stripe = require("../config/stripe");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const AppError = require("../utils/AppError");
const orderService = require("./order.service");

const clientUrl = (process.env.CLIENT_URL || "http://localhost:5173").replace(
  /\/+$/,
  "",
);

const toCents = (amount) => Math.round(amount * 100);

const createCheckoutSession = async (user, { shippingAddress }) => {
  const order = await orderService.createStripeOrder(user._id, {
    shippingAddress,
  });

  const lineItems = order.items.map((item) => {
    const description = [
      item.size && `Size: ${item.size}`,
      item.color && `Color: ${item.color}`,
    ]
      .filter(Boolean)
      .join(" · ");

    return {
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: toCents(item.price),
        product_data: { name: item.name, ...(description && { description }) },
      },
    };
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      allow_promotion_codes: true,
      customer_email: user.email,
      client_reference_id: String(order._id),
      metadata: { orderId: String(order._id) },
      line_items: lineItems,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: toCents(order.deliveryFee),
              currency: "usd",
            },
            display_name: "Delivery",
          },
        },
      ],
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min
      success_url: `${clientUrl}/order-confirmation/${order._id}`,
      cancel_url: `${clientUrl}/checkout?cancelled=1`,
    });

    order.stripeSessionId = session.id;
    await order.save();

    return session.url;
  } catch (err) {
    await Order.deleteOne({ _id: order._id }); // don't leave a dead order behind
    throw err;
  }
};

const fulfillOrder = async (sessionId) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["total_details.breakdown.discounts.discount"],
  });

  if (session.payment_status !== "paid") return;

  if (!session.metadata?.orderId) {
    console.log(
      "[Stripe fulfillment] Order matched: false (missing orderId metadata).",
    );
    return;
  }

  if (typeof session.amount_total !== "number") {
    throw new AppError("Stripe session is missing its paid total.", 502);
  }

  const discountAmount = Number(
    ((session.total_details?.amount_discount || 0) / 100).toFixed(2),
  );
  const totalAmount = Number((session.amount_total / 100).toFixed(2));
  const promotionCode = session.total_details?.breakdown?.discounts
    ?.map((entry) => entry.discount?.promotion_code)
    .find(Boolean);
  const couponCode =
    promotionCode && typeof promotionCode === "object"
      ? promotionCode.code
      : promotionCode
        ? (await stripe.promotionCodes.retrieve(promotionCode)).code
        : null;

  const order = await Order.findOneAndUpdate(
    {
      _id: session.metadata.orderId,
      stripeSessionId: session.id,
      paymentStatus: "unpaid",
    },
    {
      paymentStatus: "paid",
      paidAt: new Date(),
      stripePaymentIntentId: session.payment_intent,
      discountAmount,
      couponCode,
      totalAmount,
    },
    { new: true },
  );
  console.log(`[Stripe fulfillment] Order matched: ${Boolean(order)}.`);
  if (!order) return;

  const deducted = [];
  let outOfStock = false;

  for (const item of order.items) {
    const result = await Product.updateOne(
      { _id: item.product, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
    );
    console.log("[Stripe fulfillment] Stock update:", {
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
    if (result.modifiedCount === 0) {
      outOfStock = true;
      break;
    }
    deducted.push(item);
  }

  if (outOfStock) {
    await Promise.all(
      deducted.map((item) =>
        Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
        ),
      ),
    );
    console.log("[Stripe fulfillment] Stock rollback completed.");
    await stripe.refunds.create(
      { payment_intent: session.payment_intent },
      { idempotencyKey: `refund_${order._id}` },
    );
    order.paymentStatus = "refunded";
    order.status = "cancelled";
    await order.save();
    return;
  }

  const cartResult = await Cart.updateOne(
    { user: order.user },
    { $set: { items: [] } },
  );
  console.log("[Stripe fulfillment] Cart clear:", {
    matchedCount: cartResult.matchedCount,
    modifiedCount: cartResult.modifiedCount,
  });
};

const verifyPayment = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) throw new AppError("Order not found.", 404);
  if (order.paymentMethod !== "STRIPE" || !order.stripeSessionId) {
    throw new AppError("This order has no Stripe payment session.", 400);
  }

  if (order.paymentStatus === "unpaid") {
    await fulfillOrder(order.stripeSessionId);
  }

  return Order.findOne({ _id: order._id, user: userId }).lean();
};

const handleWebhookEvent = async (event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      if (session.payment_status === "paid") await fulfillOrder(session.id);
      break;
    }
    case "checkout.session.expired": {
      await Order.updateOne(
        { stripeSessionId: event.data.object.id, paymentStatus: "unpaid" },
        { paymentStatus: "failed" },
      );
      break;
    }
    default:
      break;
  }
};

module.exports = {
  createCheckoutSession,
  handleWebhookEvent,
  verifyPayment,
};
