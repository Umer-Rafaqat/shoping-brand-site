const Product = require("../models/Product");
const { buildAssetUrl } = require("../utils/url");

const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Reusable populate helper — works on both Query objects (find/findByIdAndUpdate)
// and Document instances (a freshly-created product), so the same helper covers
// every route below instead of repeating the two .populate() calls four times.
const populateProduct = (query) => {
  return query
    .populate("category", "name slug")
    .populate("createdBy", "name email");
};

// ─── GET /api/admin/products ─────────────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    const search = req.query.search?.trim();
    const { category, size } = req.query;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (size) filter.sizes = size;

    const [products, total] = await Promise.all([
      populateProduct(Product.find(filter))
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(), // read-only list — skip full Mongoose documents for speed
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      message: "Products fetched successfully.",
      products,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    console.error("getAllProducts error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── GET /api/admin/products/:id ─────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await populateProduct(
      Product.findById(req.params.id),
    ).lean();

    if (!product)
      return res.status(404).json({ message: "Product not found." });

    return res.status(200).json({
      message: "Product fetched successfully.",
      product,
    });
  } catch (err) {
    console.error("getProductById error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── POST /api/admin/products ────────────────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      images: existingImages,
      category,
      sizes,
      colors,
      stock,
    } = req.body;

    const images = req.files?.length
      ? req.files.map((file) => buildAssetUrl(req, file.filename))
      : parseArray(existingImages);

    let product = await Product.create({
      name,
      description,
      price,
      oldPrice: oldPrice || null,
      images,
      category,
      sizes: parseArray(sizes),
      colors: parseArray(colors),
      stock,
      createdBy: req.user._id,
    });

    product = await populateProduct(product);

    return res.status(201).json({ message: "Product created.", product });
  } catch (err) {
    console.error("createProduct error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── PUT /api/admin/products/:id ─────────────────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      images: existingImages,
      category,
      sizes,
      colors,
      stock,
    } = req.body;

    const updateData = {
      name,
      description,
      price,
      oldPrice: oldPrice || null,
      images:
        req.files?.length > 0
          ? req.files.map((file) => buildAssetUrl(req, file.filename))
          : parseArray(existingImages),
      category,
      sizes: parseArray(sizes),
      colors: parseArray(colors),
      stock,
    };

    const product = await populateProduct(
      Product.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      }),
    );

    if (!product)
      return res.status(404).json({ message: "Product not found." });

    return res.status(200).json({ message: "Product updated.", product });
  } catch (err) {
    console.error("updateProduct error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── DELETE /api/admin/products/:id ──────────────────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Product not found." });

    return res.status(200).json({ message: "Product deleted." });
  } catch (err) {
    console.error("deleteProduct error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
