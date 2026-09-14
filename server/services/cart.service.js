const Cart = require("../models/Cart");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

// Shapes a populated Cart document into exactly what the frontend's
// CartItem component expects: { id, name, image, price, size, color, quantity }.
// `id` here is the cart *line item's* id (not the product id) — needed so
// updating/removing one line doesn't affect another line of the same product
// in a different size/color.
const toCartResponse = (cart) => {
  const items = (cart?.items || [])
    // A product may have been deleted after being added to someone's cart —
    // skip those lines rather than crashing on a null populate result.
    .filter((item) => item.product)
    .map((item) => ({
      id: item._id,
      productId: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || "",
      price: item.product.price,
      stock: item.product.stock,
      size: item.size,
      color: item.color,
      quantity: item.quantity,
    }));

  return { items };
};

const populateCart = (query) =>
  query.populate("items.product", "name images price stock");

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

const getCart = async (userId) => {
  const cart = await populateCart(Cart.findOne({ user: userId }));
  return toCartResponse(cart);
};

const addItem = async (userId, { productId, size, color, quantity = 1 }) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found.", 404);

  if (product.stock < 1) {
    throw new AppError("This product is out of stock.", 400);
  }

  const cart = await getOrCreateCart(userId);

  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.size === (size || "") &&
      item.color === (color || ""),
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > product.stock) {
      throw new AppError(`Only ${product.stock} left in stock.`, 400);
    }
    existingItem.quantity = newQuantity;
  } else {
    if (quantity > product.stock) {
      throw new AppError(`Only ${product.stock} left in stock.`, 400);
    }
    cart.items.push({ product: productId, size, color, quantity });
  }

  await cart.save();

  const populated = await populateCart(Cart.findById(cart._id));
  return toCartResponse(populated);
};

const updateItemQuantity = async (userId, itemId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError("Cart not found.", 404);

  const item = cart.items.id(itemId);
  if (!item) throw new AppError("Cart item not found.", 404);

  const product = await Product.findById(item.product);
  if (product && quantity > product.stock) {
    throw new AppError(`Only ${product.stock} left in stock.`, 400);
  }

  item.quantity = quantity;
  await cart.save();

  const populated = await populateCart(Cart.findById(cart._id));
  return toCartResponse(populated);
};

const removeItem = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError("Cart not found.", 404);

  const item = cart.items.id(itemId);
  if (!item) throw new AppError("Cart item not found.", 404);

  item.deleteOne();
  await cart.save();

  const populated = await populateCart(Cart.findById(cart._id));
  return toCartResponse(populated);
};

module.exports = { getCart, addItem, updateItemQuantity, removeItem };
