const Category = require("../models/Category");
const Product = require("../models/Product");

// ─── GET /api/admin/categories ──────────────────────────────────────────────────
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.status(200).json({
      message: "Categories fetched successfully.",
      categories,
    });
  } catch (err) {
    console.error("getAllCategories error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── POST /api/admin/categories ─────────────────────────────────────────────────
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const existing = await Category.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (existing) {
      return res.status(409).json({ message: "That category already exists." });
    }

    const category = await Category.create({ name });
    return res.status(201).json({ message: "Category created.", category });
  } catch (err) {
    console.error("createCategory error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── DELETE /api/admin/categories/:id ───────────────────────────────────────────
const deleteCategory = async (req, res) => {
  try {
    const inUse = await Product.exists({ category: req.params.id });
    if (inUse) {
      return res.status(400).json({
        message: "Can't delete a category that still has products in it.",
      });
    }

    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Category not found." });

    return res.status(200).json({ message: "Category deleted." });
  } catch (err) {
    console.error("deleteCategory error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

module.exports = { getAllCategories, createCategory, deleteCategory };
