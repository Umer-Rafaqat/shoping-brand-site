const catchAsync = require("../utils/catchAsync");
const { signAccessToken, getTokenMaxAgeMs } = require("../utils/token");
const { cookieOptions } = require("../utils/cookieOptions");
const { buildAssetUrl } = require("../utils/url");
const authService = require("../services/auth.service");

const setAuthCookie = (res, userId) => {
  const accessToken = signAccessToken(userId);
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: getTokenMaxAgeMs(accessToken),
  });
};

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
const signup = catchAsync(async (req, res) => {
  const user = await authService.signup(req.body);
  setAuthCookie(res, user._id);

  return res.status(201).json({
    message: "Account created successfully.",
    user: user.toPublicJSON(),
  });
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = catchAsync(async (req, res) => {
  const user = await authService.login(req.body);
  setAuthCookie(res, user._id);

  return res.status(200).json({
    message: "Logged in successfully.",
    user: user.toPublicJSON(),
  });
});

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
const logout = (req, res) => {
  res.clearCookie("accessToken", cookieOptions);
  return res.status(200).json({ message: "Logged out successfully." });
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
// req.user.role is already populated by the `protect` middleware.
const getMe = (req, res) => {
  return res.status(200).json({
    message: "User fetched successfully.",
    user: req.user.toPublicJSON(),
  });
};

// ─── PUT /api/auth/me ──────────────────────────────────────────────────────────
const updateProfile = catchAsync(async (req, res) => {
  const avatarUrl = req.file
    ? buildAssetUrl(req, req.file.filename)
    : undefined;

  const updated = await authService.updateProfile(
    req.user._id,
    { ...req.body, avatarUrl },
    req.user.email,
  );

  return res.status(200).json({
    message: "Profile updated successfully.",
    user: updated.toPublicJSON(),
  });
});

// ─── PUT /api/auth/admin-profile ────────────────────────────────────────────────
const updateAdminProfile = catchAsync(async (req, res) => {
  const avatarUrl = req.file
    ? buildAssetUrl(req, req.file.filename)
    : req.user.avatarUrl || "";

  const updated = await authService.updateAdminProfile(req.user._id, {
    name: req.body.name,
    username: req.body.username,
    avatarUrl,
  });

  return res.status(200).json({
    message: "Admin profile updated successfully.",
    user: updated.toPublicJSON(),
  });
});

// ─── PUT /api/auth/change-password ─────────────────────────────────────────────
const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user._id, req.body);
  return res.status(200).json({ message: "Password changed successfully." });
});

// ─── DELETE /api/auth/me ───────────────────────────────────────────────────────
const deleteAccount = catchAsync(async (req, res) => {
  await authService.deleteAccount(req.user._id, req.body.password);
  res.clearCookie("accessToken", cookieOptions);
  return res.status(200).json({ message: "Account deleted successfully." });
});

module.exports = {
  signup,
  login,
  logout,
  getMe,
  updateProfile,
  updateAdminProfile,
  changePassword,
  deleteAccount,
};
