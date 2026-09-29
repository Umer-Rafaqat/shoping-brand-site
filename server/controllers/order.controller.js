const catchAsync = require("../utils/catchAsync");
const { getPagination } = require("../utils/pagination");
const orderService = require("../services/order.service");

// ─── POST /api/orders ────────────────────────────────────────────────────────
const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  return res.status(201).json({ message: "Order placed successfully.", order });
});

// ─── GET /api/orders ─────────────────────────────────────────────────────────
const getMyOrders = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req, 10);

  const { orders, total } = await orderService.getMyOrders(req.user._id, {
    page,
    limit,
    skip,
  });

  return res.status(200).json({
    message: "Orders fetched successfully.",
    orders,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

// ─── GET /api/orders/:id ─────────────────────────────────────────────────────
const getMyOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getMyOrderById(req.user._id, req.params.id);
  return res
    .status(200)
    .json({ message: "Order fetched successfully.", order });
});

// ─── PUT /api/orders/:id/cancel ──────────────────────────────────────────────
const cancelMyOrder = catchAsync(async (req, res) => {
  const order = await orderService.cancelMyOrder(req.user._id, req.params.id);
  return res.status(200).json({ message: "Order cancelled.", order });
});

module.exports = { createOrder, getMyOrders, getMyOrderById, cancelMyOrder };
