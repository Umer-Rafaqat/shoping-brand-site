const catchAsync = require("../utils/catchAsync");
const { getPagination } = require("../utils/pagination");
const {
  parseCSVParam,
  parseNumberParam,
  trimParam,
} = require("../utils/queryHelpers");
const publicProductService = require("../services/publicProduct.service");

// ─── GET /api/products ────────────────────────────────────────────────────────
const getPublicProducts = catchAsync(async (req, res) => {
  const { page, limit } = getPagination(req, 12);

  const { products, total } = await publicProductService.getPublicProducts({
    page,
    limit,
    search: trimParam(req.query.search),
    category: req.query.category,
    colors: parseCSVParam(req.query.colors),
    sizes: parseCSVParam(req.query.sizes),
    exclude: parseCSVParam(req.query.exclude),
    sort: req.query.sort || "newest",
    minPrice: parseNumberParam(req.query.minPrice),
    maxPrice: parseNumberParam(req.query.maxPrice),
  });

  return res.status(200).json({
    message: "Products fetched successfully.",
    products,
    page,
    totalPages: Math.ceil(total / limit),
    total,
  });
});

// ─── GET /api/products/:id ─────────────────────────────────────────────────────
const getPublicProductById = catchAsync(async (req, res) => {
  const product = await publicProductService.getPublicProductById(
    req.params.id,
  );
  return res
    .status(200)
    .json({ message: "Product fetched successfully.", product });
});

module.exports = { getPublicProducts, getPublicProductById };
