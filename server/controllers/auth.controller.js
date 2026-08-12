const User = require("../models/User");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
} = require("../utils/token");

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
    const refreshToken = signRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, {
      $push: {
        refreshTokens: { $each: [refreshToken], $slice: -MAX_SESSIONS },
      },
    });

    setRefreshCookie(res, refreshToken);

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
    const refreshToken = signRefreshToken(user._id);

    await User.findByIdAndUpdate(user._id, {
      $push: {
        refreshTokens: { $each: [refreshToken], $slice: -MAX_SESSIONS },
      },
    });

    setRefreshCookie(res, refreshToken);

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

// ─── POST /api/auth/refresh ───────────────────────────────────────────────────
const refresh = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "No refresh token provided." });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      clearRefreshCookie(res);
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token." });
    }

    const userAfterPull = await User.findOneAndUpdate(
      { _id: decoded.sub, refreshTokens: token },
      { $pull: { refreshTokens: token } },
      { new: true },
    );

    if (!userAfterPull) {
      clearRefreshCookie(res);
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token." });
    }

    const newAccessToken = signAccessToken(userAfterPull._id);
    const newRefreshToken = signRefreshToken(userAfterPull._id);

    await User.findByIdAndUpdate(userAfterPull._id, {
      $push: {
        refreshTokens: { $each: [newRefreshToken], $slice: -MAX_SESSIONS },
      },
    });

    setRefreshCookie(res, newRefreshToken);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("refresh error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
const logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (token) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { refreshTokens: token },
      });
    }

    clearRefreshCookie(res);
    return res.status(200).json({ message: "Logged out successfully." });
  } catch (err) {
    console.error("logout error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = (req, res) => {
  return res.status(200).json({ user: req.user.toPublicJSON() });
};

module.exports = { signup, login, refresh, logout, getMe };
