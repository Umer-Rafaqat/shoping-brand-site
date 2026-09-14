const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const { searchRegex } = require("../utils/queryHelpers");
const { parseArray } = require("../utils/parseArray");

// IMPORTANT: only pass a Query here (Product.find(...), Product.findById(...),
// Product.findByIdAndUpdate(...)) — never a Document. Query.populate() returns
// the same chainable Query, but Document.populate() returns a Promise, so a
// second chained .populate() call on a Document throws
// "TypeError: ....populate(...).populate is not a function".
const populateProduct = (query) =>
  query.populate("category", "name slug").populate("createdBy", "name email");

const getAllProducts = async ({
  page,
  limit,
  skip,
  search,
  category,
  size,
}) => {
  const filter = {};
  if (search) filter.name = searchRegex(search);
  if (category) filter.category = category;
  if (size) filter.sizes = size;

  const [products, total] = await Promise.all([
    populateProduct(Product.find(filter))
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Product.countDocuments(filter),
  ]);

  return { products, total };
};

const getProductById = async (id) => {
  const product = await populateProduct(Product.findById(id)).lean();
  if (!product) throw new AppError("Product not found.", 404);

  return product;
};

// `images` arrives already-resolved to final URLs — the controller computes
// that from req.files/buildAssetUrl since it needs `req`, which never reaches
// the service.
const createProduct = async (data, userId) => {
  const {
    name,
    description,
    price,
    oldPrice,
    images,
    category,
    sizes,
    colors,
    stock,
  } = data;

  const created = await Product.create({
    name,
    description,
    price,
    oldPrice: oldPrice || null,
    images,
    category,
    sizes: parseArray(sizes),
    colors: parseArray(colors),
    stock,
    createdBy: userId,
  });

  // Re-fetch by id instead of populating `created` directly — `created` is a
  // Document, and populateProduct() only works safely on a Query (see the
  // comment above it).
  return populateProduct(Product.findById(created._id));
};

const updateProduct = async (id, data) => {
  const {
    name,
    description,
    price,
    oldPrice,
    images,
    category,
    sizes,
    colors,
    stock,
  } = data;

  const product = await populateProduct(
    Product.findByIdAndUpdate(
      id,
      {
        name,
        description,
        price,
        oldPrice: oldPrice || null,
        images,
        category,
        sizes: parseArray(sizes),
        colors: parseArray(colors),
        stock,
      },
      { new: true, runValidators: true },
    ),
  );

  if (!product) throw new AppError("Product not found.", 404);
  return product;
};

const deleteProduct = async (id) => {
  const deleted = await Product.findByIdAndDelete(id);
  if (!deleted) throw new AppError("Product not found.", 404);
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
