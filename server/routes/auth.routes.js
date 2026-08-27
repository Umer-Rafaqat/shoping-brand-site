const express = require("express");
const rateLimit = require("express-rate-limit");

const {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
  updateAdminProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { upload } = require("../middleware/upload");
const {
  validate,
  signupRules,
  loginRules,
  updateProfileRules,
  adminProfileRules,
  changePasswordRules,
  deleteAccountRules,
} = require("../middleware/validate");

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

// My Account (CRUD)
router.put("/me", protect, updateProfileRules, validate, updateProfile);
router.put("/admin-profile", protect, authorize("admin"), upload.single("avatar"), adminProfileRules, validate, updateAdminProfile);
router.put(
  "/change-password",
  protect,
  changePasswordRules,
  validate,
  changePassword,
);
router.delete("/me", protect, deleteAccountRules, validate, deleteAccount);

module.exports = router;
