const User = require("../models/User");
const Role = require("../models/Role");
const AppError = require("../utils/AppError");

const signup = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new AppError("Email already in use.", 409);

  const userRole = await Role.findOrCreate("user");
  const user = await User.create({ name, email, password, role: userRole._id });
  await user.populate("role");

  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email })
    .select("+password")
    .populate("role");
  if (!user) throw new AppError("Invalid email or password.", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid email or password.", 401);

  return user;
};

// `avatarUrl` arrives already-computed by the controller (buildAssetUrl needs
// `req`), or `undefined` if the user didn't pick a new picture this time —
// in which case we simply don't touch the existing one.
const updateProfile = async (
  userId,
  { name, email, avatarUrl },
  currentEmail,
) => {
  if (email !== currentEmail) {
    const existing = await User.findOne({ email, _id: { $ne: userId } });
    if (existing) throw new AppError("Email already in use.", 409);
  }

  const updateData = { name, email };
  if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;

  const updated = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).populate("role");

  return updated;
};

// `avatarUrl` arrives already-computed (buildAssetUrl needs `req`, which stays
// in the controller — the service only ever deals with plain data).
const updateAdminProfile = async (userId, { name, username, avatarUrl }) => {
  const normalizedUsername = username.toLowerCase();

  const existing = await User.findOne({
    username: normalizedUsername,
    _id: { $ne: userId },
  });
  if (existing) throw new AppError("Username already in use.", 409);

  const updated = await User.findByIdAndUpdate(
    userId,
    { name, username: normalizedUsername, avatarUrl },
    { new: true, runValidators: true },
  ).populate("role");

  return updated;
};

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new AppError("Current password is incorrect.", 401);

  user.password = newPassword;
  await user.save();
};

const deleteAccount = async (userId, password) => {
  const user = await User.findById(userId).select("+password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Incorrect password.", 401);

  await User.findByIdAndDelete(userId);
};

module.exports = {
  signup,
  login,
  updateProfile,
  updateAdminProfile,
  changePassword,
  deleteAccount,
};
