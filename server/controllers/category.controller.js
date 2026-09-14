const catchAsync = require("../utils/catchAsync");
const categoryService = require("../services/category.service");

// ─── GET /api/admin/categories ──────────────────────────────────────────────────
const getAllCategories = catchAsync(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  return res
    .status(200)
    .json({ message: "Categories fetched successfully.", categories });
});

// ─── POST /api/admin/categories ─────────────────────────────────────────────────
const createCategory = catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body.name);
  return res.status(201).json({ message: "Category created.", category });
});

// ─── DELETE /api/admin/categories/:id ───────────────────────────────────────────
const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  return res.status(200).json({ message: "Category deleted." });
});

module.exports = { getAllCategories, createCategory, deleteCategory };
