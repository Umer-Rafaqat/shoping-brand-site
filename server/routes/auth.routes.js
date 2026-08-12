const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  signup,
  login,
  logout,
  getMe,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const { validate, signupRules, loginRules } = require("../middleware/validate");

const router = express.Router();

// ─── Rate limiters ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { message: "Too many refresh requests." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Routes ──────────────────────────────────────────────────────────────────
router.post("/signup", authLimiter, signupRules, validate, signup);
router.post("/login", authLimiter, loginRules, validate, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
