const User = require("../models/User");
const { signAccessToken } = require("../utils/token");

const MAX_SESSIONS = 5;

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const user = await User.create({ name, email, password });

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

    const user = await User.findOne({ email }).select("+password");
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
const getMe = (req, res) => {
  return res.status(200).json({ user: req.user.toPublicJSON() });
};

module.exports = { signup, login, logout, getMe };
