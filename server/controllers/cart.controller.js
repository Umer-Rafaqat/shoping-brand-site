const catchAsync = require("../utils/catchAsync");
const cartService = require("../services/cart.service");

// ─── GET /api/cart ─────────────────────────────────────────────────────────────
const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  return res
    .status(200)
    .json({ message: "Cart fetched successfully.", ...cart });
});

// ─── POST /api/cart ─────────────────────────────────────────────────────────────
const addItem = catchAsync(async (req, res) => {
  const cart = await cartService.addItem(req.user._id, req.body);
  return res.status(201).json({ message: "Item added to cart.", ...cart });
});

// ─── PUT /api/cart/:itemId ──────────────────────────────────────────────────────
const updateItem = catchAsync(async (req, res) => {
  const cart = await cartService.updateItemQuantity(
    req.user._id,
    req.params.itemId,
    req.body.quantity,
  );
  return res.status(200).json({ message: "Cart item updated.", ...cart });
});

// ─── DELETE /api/cart/:itemId ───────────────────────────────────────────────────
const removeItem = catchAsync(async (req, res) => {
  const cart = await cartService.removeItem(req.user._id, req.params.itemId);
  return res.status(200).json({ message: "Item removed from cart.", ...cart });
});

module.exports = { getCart, addItem, updateItem, removeItem };
