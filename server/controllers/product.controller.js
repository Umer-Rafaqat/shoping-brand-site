const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const { getPagination } = require("../utils/pagination");
const { trimParam } = require("../utils/queryHelpers");
const { parseArray } = require("../utils/parseArray");
const { buildAssetUrl } = require("../utils/url");
const productService = require("../services/product.service");

const resolveImages = (req) => {
  const images = req.files?.length
    ? req.files.map((file) => buildAssetUrl(req, file.filename))
    : parseArray(req.body.images);

  if (images.length === 0) {
    throw new AppError("Please upload at least one product image.", 400);
  }

  return images;
};

// ─── GET /api/admin/products ─────────────────────────────────────────────────────
const getAllProducts = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req, 20);

  const { products, total } = await productService.getAllProducts({
    page,
    limit,
    skip,
    search: trimParam(req.query.search),
    category: req.query.category,
    size: req.query.size,
  });

  return res.status(200).json({
    message: "Products fetched successfully.",
    products,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

// ─── GET /api/admin/products/:id ─────────────────────────────────────────────────
const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  return res
    .status(200)
    .json({ message: "Product fetched successfully.", product });
});

// ─── POST /api/admin/products ────────────────────────────────────────────────────
const createProduct = catchAsync(async (req, res) => {
  const product = await productService.createProduct(
    { ...req.body, images: resolveImages(req) },
    req.user._id,
  );

  return res.status(201).json({ message: "Product created.", product });
});

// ─── PUT /api/admin/products/:id ─────────────────────────────────────────────────
const updateProduct = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, {
    ...req.body,
    images: resolveImages(req),
  });

  return res.status(200).json({ message: "Product updated.", product });
});

// ─── DELETE /api/admin/products/:id ──────────────────────────────────────────────
const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  return res.status(200).json({ message: "Product deleted." });
});

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
