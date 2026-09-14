const catchAsync = require("../utils/catchAsync");
const { getPagination } = require("../utils/pagination");
const { trimParam } = require("../utils/queryHelpers");
const adminService = require("../services/admin.service");

// ─── GET /api/admin/users ──────────────────────────────────────────────────────
const getAllUsers = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req, 20);

  const { users, total } = await adminService.getAllUsers({
    page,
    limit,
    skip,
    search: trimParam(req.query.search),
    excludeId: req.user._id,
  });

  return res.status(200).json({
    message: "Users fetched successfully.",
    users,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

// ─── POST /api/admin/users ──────────────────────────────────────────────────────
const createUser = catchAsync(async (req, res) => {
  const user = await adminService.createUser(req.body);
  return res.status(201).json({ message: "User created successfully.", user });
});

// ─── GET /api/admin/users/:id ──────────────────────────────────────────────────
const getUserById = catchAsync(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);
  return res.status(200).json({ message: "User fetched successfully.", user });
});

// ─── PUT /api/admin/users/:id ───────────────────────────────────────────────────
const updateUser = catchAsync(async (req, res) => {
  const user = await adminService.updateUser(req.params.id, req.body);
  return res.status(200).json({ message: "User updated successfully.", user });
});

// ─── DELETE /api/admin/users/:id ───────────────────────────────────────────────
const deleteUser = catchAsync(async (req, res) => {
  await adminService.deleteUser(req.params.id, req.user._id);
  return res.status(200).json({ message: "User deleted successfully." });
});

// ─── GET /api/admin/carts ───────────────────────────────────────────────────────
const getAllCartActivity = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req, 20);

  const { rows, total } = await adminService.getAllCartActivity({
    page,
    limit,
    skip,
  });

  return res.status(200).json({
    message: "Cart activity fetched successfully.",
    rows,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllCartActivity,
};
