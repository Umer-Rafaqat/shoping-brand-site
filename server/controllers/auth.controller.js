const User = require("../models/User");
const Role = require("../models/Role");
const { signAccessToken } = require("../utils/token");

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
const signup = async (req, res) => {
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

    const accessToken = signAccessToken(user._id);

    return res.status(201).json({
      message: "Account created successfully.",
      accessToken,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .select("+password")
      .populate("role");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const accessToken = signAccessToken(user._id);

    return res.status(200).json({
      message: "Logged in successfully.",
      accessToken,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
const logout = (req, res) => {
  return res.status(200).json({ message: "Logged out successfully." });
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
// req.user.role is already populated by the `protect` middleware.
const getMe = (req, res) => {
  return res.status(200).json({ user: req.user.toPublicJSON() });
};

// ─── PUT /api/auth/me ──────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (email !== req.user.email) {
      const existing = await User.findOne({
        email,
        _id: { $ne: req.user._id },
      });
      if (existing) {
        return res.status(409).json({ message: "Email already in use." });
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    ).populate("role");

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updated.toPublicJSON(),
    });
  } catch (err) {
    console.error("updateProfile error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── PUT /api/auth/change-password ─────────────────────────────────────────────
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("changePassword error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── DELETE /api/auth/me ───────────────────────────────────────────────────────
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    await User.findByIdAndDelete(req.user._id);

    return res.status(200).json({ message: "Account deleted successfully." });
  } catch (err) {
    console.error("deleteAccount error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  deleteAccount,
};
