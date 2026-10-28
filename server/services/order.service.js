const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const { getNextSequence } = require("../utils/counter");
const { settledOrdersFilter } = require("../utils/orderFilters");

const DELIVERY_FEE = 15;

const visibleToCustomer = (userId) => ({
  user: userId,
  ...settledOrdersFilter,
});
const buildOrderDraft = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new AppError("Your cart is empty.", 400);
  }

  const orderItems = [];

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      throw new AppError(
        "One of the items in your cart no longer exists.",
        400,
      );
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Only ${product.stock} left in stock for "${product.name}".`,
        400,
      );
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    });
  }

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    cart,
    orderItems,
    subtotal,
    totalAmount: subtotal + DELIVERY_FEE,
  };
};

const createOrder = async (userId, { shippingAddress }) => {
  const { cart, orderItems, subtotal, totalAmount } =
    await buildOrderDraft(userId);

  const orderNumber = await getNextSequence("orderNumber");

  const order = await Order.create({
    orderNumber,
    user: userId,
    items: orderItems,
    shippingAddress,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    totalAmount,
    paymentMethod: "COD",
    status: "pending",
  });

  await Promise.all(
    orderItems.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      }),
    ),
  );

  cart.items = [];
  await cart.save();

  return order;
};

const createStripeOrder = async (userId, { shippingAddress }) => {
  const { orderItems, subtotal, totalAmount } = await buildOrderDraft(userId);

  const orderNumber = await getNextSequence("orderNumber");

  return Order.create({
    orderNumber,
    user: userId,
    items: orderItems,
    shippingAddress,
    subtotal,
    deliveryFee: DELIVERY_FEE,
    totalAmount,
    paymentMethod: "STRIPE",
    paymentStatus: "unpaid",
    status: "pending",
  });
};

const getMyOrders = async (userId, { page, limit, skip }) => {
  const filter = visibleToCustomer(userId);

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments(filter),
  ]);

  return { orders, total };
};

const getMyOrderById = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  }).lean();

  if (!order) throw new AppError("Order not found.", 404);
  return order;
};

const cancelMyOrder = async (userId, orderId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  });

  if (!order) throw new AppError("Order not found.", 404);

  if (order.paymentMethod === "STRIPE") {
    throw new AppError(
      "Card orders can't be cancelled online yet. Please contact support.",
      400,
    );
  }

  if (order.status !== "pending") {
    throw new AppError(
      "This order can no longer be cancelled — it's already being processed.",
      400,
    );
  }

  order.status = "cancelled";
  await order.save();

  await Promise.all(
    order.items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      }),
    ),
  );

  return order;
};

module.exports = {
  DELIVERY_FEE,
  createOrder,
  createStripeOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
};
