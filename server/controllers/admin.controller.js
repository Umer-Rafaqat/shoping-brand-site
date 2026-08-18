const User = require("../models/User");
const Role = require("../models/Role");

// ─── GET /api/admin/users ──────────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const search = req.query.search?.trim();

    // Never show the logged-in admin their own account in this list.
    const filter = { _id: { $ne: req.user._id } };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(filter)
        .populate("role")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      users: users.map((u) => u.toPublicJSON()),
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── POST /api/admin/users ──────────────────────────────────────────────────────
// Role is always forced to "user" here — this endpoint can never be used
// to create an admin. New admins only ever come from scripts/makeAdmin.js.
const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const userRole = await Role.findOrCreate("user");
    const user = await User.create({
      name,
      email,
      password,
      role: userRole._id,
    });
    await user.populate("role");

    return res.status(201).json({
      message: "User created successfully.",
      user: user.toPublicJSON(),
    });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── GET /api/admin/users/:id ──────────────────────────────────────────────────
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");
    if (!user) return res.status(404).json({ message: "User not found." });

    return res.status(200).json({ user: user.toPublicJSON() });
  } catch (err) {
    console.error("getUserById error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── PUT /api/admin/users/:id ───────────────────────────────────────────────────
// Edit name/email only — role is never accepted here. Admin accounts are
// also off-limits: an admin can only manage regular users through this panel.
const updateUser = async (req, res) => {
  try {
    const target = await User.findById(req.params.id).populate("role");
    if (!target) return res.status(404).json({ message: "User not found." });

    if (target.role?.name === "admin") {
      return res
        .status(403)
        .json({ message: "Admin accounts can't be edited from here." });
    }

    const { name, email } = req.body;

    if (email && email !== target.email) {
      const existing = await User.findOne({ email, _id: { $ne: target._id } });
      if (existing) {
        return res.status(409).json({ message: "Email already in use." });
      }
    }

    if (name !== undefined) target.name = name;
    if (email !== undefined) target.email = email;
    await target.save();

    return res.status(200).json({
      message: "User updated successfully.",
      user: target.toPublicJSON(),
    });
  } catch (err) {
    console.error("updateUser error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── DELETE /api/admin/users/:id ───────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === String(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You can't delete your own account here." });
    }

    const target = await User.findById(req.params.id).populate("role");
    if (!target) return res.status(404).json({ message: "User not found." });

    if (target.role?.name === "admin") {
      return res
        .status(403)
        .json({ message: "Admin accounts can't be deleted from here." });
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
