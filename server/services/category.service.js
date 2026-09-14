const Category = require("../models/Category");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");

const getAllCategories = async () => {
  return Category.find().sort({ name: 1 });
};

const createCategory = async (name) => {
  const existing = await Category.findOne({
    name: new RegExp(`^${name}$`, "i"),
  });
  if (existing) throw new AppError("That category already exists.", 409);

  return Category.create({ name });
};

const deleteCategory = async (id) => {
  const inUse = await Product.exists({ category: id });
  if (inUse) {
    throw new AppError(
      "Can't delete a category that still has products in it.",
      400,
    );
  }

  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) throw new AppError("Category not found.", 404);
};

module.exports = { getAllCategories, createCategory, deleteCategory };
