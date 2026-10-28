const User = require("../models/User");
const Role = require("../models/Role");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const { searchRegex } = require("../utils/queryHelpers");
const stripe = require("../config/stripe");
const { settledOrdersFilter } = require("../utils/orderFilters");
const populateRole = (query) => query.populate("role");

const getAllUsers = async ({ page, limit, skip, search, excludeId }) => {
  const filter = { _id: { $ne: excludeId } };

  if (search) {
    filter.$or = [
      { name: searchRegex(search) },
      { email: searchRegex(search) },
    ];
  }

  const [users, total] = await Promise.all([
    populateRole(User.find(filter))
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(filter),
  ]);

  return { users: users.map((u) => u.toPublicJSON()), total };
};

// Role is always forced to "user" here — this can never create an admin.
// New admins only ever come from scripts/makeAdmin.js.
const createUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });

  if (existing) throw new AppError("Email already in use.", 409);

  const userRole = await Role.findOrCreate("user");

  const user = await User.create({
    name,
    email,
    password,
    role: userRole._id,
  });

  await user.populate("role");

  return user.toPublicJSON();
};

const getUserById = async (id) => {
  const user = await populateRole(User.findById(id));

  if (!user) throw new AppError("User not found.", 404);

  return user.toPublicJSON();
};
const updateUser = async (id, { name, email }) => {
  const target = await populateRole(User.findById(id));

  if (!target) throw new AppError("User not found.", 404);

  if (target.role?.name === "admin") {
    throw new AppError("Admin accounts can't be edited from here.", 403);
  }

  if (email && email !== target.email) {
    const existing = await User.findOne({
      email,
      _id: { $ne: target._id },
    });

    if (existing) throw new AppError("Email already in use.", 409);
  }

  if (name !== undefined) target.name = name;
  if (email !== undefined) target.email = email;

  await target.save();

  return target.toPublicJSON();
};

const deleteUser = async (id, requestingUserId) => {
  if (id === String(requestingUserId)) {
    throw new AppError("You can't delete your own account here.", 400);
  }

  const target = await populateRole(User.findById(id));

  if (!target) throw new AppError("User not found.", 404);

  if (target.role?.name === "admin") {
    throw new AppError("Admin accounts can't be deleted from here.", 403);
  }

  await User.findByIdAndDelete(id);
};

const getAllCartActivity = async ({ page, limit, skip }) => {
  const carts = await Cart.find({ "items.0": { $exists: true } })
    .populate("user", "name email")
    .populate("items.product", "name images price")
    .lean();

  const rows = [];

  for (const cart of carts) {
    if (!cart.user) continue;

    for (const item of cart.items) {
      if (!item.product) continue;

      rows.push({
        cartItemId: item._id,
        user: {
          name: cart.user.name,
          email: cart.user.email,
        },
        product: {
          name: item.product.name,
          image: item.product.images?.[0] || "",
          price: item.product.price,
        },
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        addedAt: item.createdAt,
      });
    }
  }

  rows.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));

  const total = rows.length;
  const paginatedRows = rows.slice(skip, skip + limit);

  return { rows: paginatedRows, total };
};

// ─── Orders (admin) ─────────────────────────────────────────────────────────────

const getAllOrders = async ({ page, limit, skip, status }) => {
  const filter = { ...settledOrdersFilter };

  if (status) filter.status = status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return { orders, total };
};

const getOrderById = async (orderId) => {
  const order = await Order.findById(orderId)
    .populate("user", "name email")
    .lean();

  if (!order) throw new AppError("Order not found.", 404);

  return order;
};

const restockItems = (items) =>
  Promise.all(
    items.map((item) =>
      Product.updateOne(
        { _id: item.product },
        { $inc: { stock: item.quantity } },
      ),
    ),
  );

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);

  if (!order) throw new AppError("Order not found.", 404);

  const isStripe = order.paymentMethod === "STRIPE";
  const isPaidStripe = isStripe && order.paymentStatus === "paid";

  if (isStripe && !["paid", "refunded"].includes(order.paymentStatus)) {
    throw new AppError(
      "This card order hasn't been paid, so its status can't be changed.",
      400,
    );
  }

  if (order.status === status) {
    return getOrderById(orderId);
  }

  if (order.status === "cancelled") {
    throw new AppError(
      "Cancelled orders can't be reopened. Ask the customer to place a new order.",
      400,
    );
  }
  if (status !== "cancelled") {
    order.status = status;
    await order.save();

    return getOrderById(orderId);
  }

  if (isPaidStripe) {
    try {
      await stripe.refunds.create(
        {
          payment_intent: order.stripePaymentIntentId,
        },
        {
          idempotencyKey: `refund_${order._id}`,
        },
      );
    } catch (err) {
      console.error("Stripe refund failed:", err);

      throw new AppError(
        "Couldn't refund the payment through Stripe, so the order was not cancelled.",
        502,
      );
    }
  }
  const cancelled = await Order.findOneAndUpdate(
    {
      _id: order._id,
      status: { $ne: "cancelled" },
    },
    {
      status: "cancelled",
      ...(isPaidStripe && { paymentStatus: "refunded" }),
    },
    {
      new: true,
    },
  );

  if (cancelled) {
    await restockItems(order.items);
  }

  return getOrderById(orderId);
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllCartActivity,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};
