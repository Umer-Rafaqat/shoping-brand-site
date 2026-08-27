const Product = require("../models/Product");

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

// ─── GET /api/admin/products ─────────────────────────────────────────────────────
const getAllProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const search = req.query.search?.trim();
    const category = req.query.category;
    const size = req.query.size;

    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (size) filter.sizes = size;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
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
    console.error("getAllProducts error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

// ─── GET /api/admin/products/:id ─────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("createdBy", "name email");

    if (!product)
      return res.status(404).json({ message: "Product not found." });

    return res.status(200).json({ product });
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

    const product = await Product.create({
      name,
      description,
      price,
      oldPrice: oldPrice || null,
      images: req.files?.map((file) => file.filename) || parseArray(existingImages),
      category,
      sizes: parseArray(sizes),
      colors: parseArray(colors),
      stock,
      createdBy: req.user._id,
    });

    await product.populate("category", "name slug");
    await product.populate("createdBy", "name email");

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

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        oldPrice: oldPrice || null,
        images:
          req.files?.length > 0
            ? req.files.map((file) => file.filename)
            : parseArray(existingImages),
        category,
        sizes: parseArray(sizes),
        colors: parseArray(colors),
        stock,
      },
      { new: true, runValidators: true },
    )
      .populate("category", "name slug")
      .populate("createdBy", "name email");

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
