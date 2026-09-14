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
const { validate } = require("../middleware/validate");
const {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  adminProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} = require("../validations/auth.validation");

const router = express.Router();

// ─── Rate limiters ────────────────────────────────────────────────────────────
// In development we skip the limit entirely so testing (Postman, manual
// retries, etc.) never gets blocked. In production this is never skipped —
// the real bruteforce protection stays fully active there.
const isDev = process.env.NODE_ENV !== "production";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts. Try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: { message: "Too many refresh requests." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isDev,
});

// ─── Routes ──────────────────────────────────────────────────────────────────
router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

// My Account (CRUD)
router.put(
  "/me",
  protect,
  upload.single("avatar"),
  validate(updateProfileSchema),
  updateProfile,
);
router.put(
  "/admin-profile",
  protect,
  authorize("admin"),
  upload.single("avatar"),
  validate(adminProfileSchema),
  updateAdminProfile,
);
router.put(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword,
);
router.delete("/me", protect, validate(deleteAccountSchema), deleteAccount);

module.exports = router;
