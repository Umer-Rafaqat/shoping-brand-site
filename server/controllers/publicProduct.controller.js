const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

const getPublicProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 12);
    const search = req.query.search?.trim();
    const category = req.query.category;
    const colors = req.query.colors?.split(",").filter(Boolean) || [];
    const sizes = req.query.sizes?.split(",").filter(Boolean) || [];
    const exclude = req.query.exclude?.split(",").filter(Boolean) || [];
    const sort = req.query.sort || "newest";
    const minPrice = req.query.minPrice
      ? Number(req.query.minPrice)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? Number(req.query.maxPrice)
      : undefined;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) {
      let categoryDocument = await Category.findOne({ slug: category }).select(
        "_id",
      );
      if (!categoryDocument && mongoose.isValidObjectId(category)) {
        categoryDocument = await Category.findById(category).select("_id");
      }

      if (!categoryDocument) {
        return res.status(200).json({
          products: [],
          page,
          totalPages: 0,
          total: 0,
        });
      }

      filter.category = categoryDocument._id;
    }
    if (colors.length) filter.colors = { $in: colors };
    if (sizes.length) filter.sizes = { $in: sizes };
    if (exclude.length) filter._id = { $nin: exclude };
    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    const sortOrder =
      sort === "priceAsc"
        ? { price: 1, createdAt: -1 }
        : sort === "priceDesc"
          ? { price: -1, createdAt: -1 }
          : sort === "topSelling"
            ? { numReviews: -1, rating: -1, createdAt: -1 }
            : { createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOrder)
        .skip((page - 1) * limit)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    console.error("getPublicProducts error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

const getPublicProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug",
    );
    if (!product)
      return res.status(404).json({ message: "Product not found." });

    return res.status(200).json({ product });
  } catch (err) {
    console.error("getPublicProductById error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

module.exports = { getPublicProducts, getPublicProductById };
