const User = require("../models/User");
const Role = require("../models/Role");
const Cart = require("../models/Cart");
const AppError = require("../utils/AppError");
const { searchRegex } = require("../utils/queryHelpers");

const populateRole = (query) => query.populate("role");

const getAllUsers = async ({ page, limit, skip, search, excludeId }) => {
  // Never show the logged-in admin their own account in this list.
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
  const user = await User.create({ name, email, password, role: userRole._id });
  await user.populate("role");

  return user.toPublicJSON();
};

const getUserById = async (id) => {
  const user = await populateRole(User.findById(id));
  if (!user) throw new AppError("User not found.", 404);

  return user.toPublicJSON();
};

// Edit name/email only — role is never accepted here. Admin accounts are also
// off-limits: an admin can only manage regular users through this panel.
const updateUser = async (id, { name, email }) => {
  const target = await populateRole(User.findById(id));
  if (!target) throw new AppError("User not found.", 404);

  if (target.role?.name === "admin") {
    throw new AppError("Admin accounts can't be edited from here.", 403);
  }

  if (email && email !== target.email) {
    const existing = await User.findOne({ email, _id: { $ne: target._id } });
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

// Flattens every user's cart into individual rows (one row per line item)
// for the admin's "Cart Activity" table — kept as a simple on-demand read
// (fetched when the admin opens the page), not a real-time push feed.
const getAllCartActivity = async ({ page, limit, skip }) => {
  const carts = await Cart.find({ "items.0": { $exists: true } })
    .populate("user", "name email")
    .populate("items.product", "name images price")
    .lean();

  const rows = [];
  for (const cart of carts) {
    if (!cart.user) continue; // user account may have been deleted since
    for (const item of cart.items) {
      if (!item.product) continue; // product may have been deleted since
      rows.push({
        cartItemId: item._id,
        user: { name: cart.user.name, email: cart.user.email },
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

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getAllCartActivity,
};
