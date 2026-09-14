const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const AppError = require("../utils/AppError");
const { searchRegex } = require("../utils/queryHelpers");

// .lean() skips Mongoose's document wrapping and returns plain JS objects —
// lighter and faster for read-only data. Since lean() also skips virtuals, we
// compute discountPercent manually here to keep the API response unchanged.
const withDiscountPercent = (product) => {
  const { oldPrice, price } = product;
  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;
  return { ...product, discountPercent };
};

const buildSortOrder = (sort) =>
  sort === "priceAsc"
    ? { price: 1, createdAt: -1 }
    : sort === "priceDesc"
      ? { price: -1, createdAt: -1 }
      : sort === "topSelling"
        ? { numReviews: -1, rating: -1, createdAt: -1 }
        : { createdAt: -1 };

const getPublicProducts = async ({
  page,
  limit,
  search,
  category,
  colors,
  sizes,
  exclude,
  sort,
  minPrice,
  maxPrice,
}) => {
  const filter = {};
  if (search) filter.name = searchRegex(search);

  if (category) {
    let categoryDocument = await Category.findOne({ slug: category })
      .select("_id")
      .lean();
    if (!categoryDocument && mongoose.isValidObjectId(category)) {
      categoryDocument = await Category.findById(category).select("_id").lean();
    }

    if (!categoryDocument) {
      return { products: [], total: 0 };
    }

    filter.category = categoryDocument._id;
  }

  if (colors.length) filter.colors = { $in: colors };
  if (sizes.length) filter.sizes = { $in: sizes };
  if (exclude.length) {
    filter._id = {
      $nin: exclude
        .filter(mongoose.isValidObjectId)
        .map((id) => new mongoose.Types.ObjectId(id)),
    };
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = minPrice;
    if (maxPrice !== undefined) filter.price.$lte = maxPrice;
  }

  // $facet runs the paginated "data" pipeline and the "total count" pipeline
  // in a single aggregation call — one round trip to MongoDB.
  const [result] = await Product.aggregate([
    { $match: filter },
    {
      $facet: {
        data: [
          { $sort: buildSortOrder(sort) },
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "category",
            },
          },
          {
            $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
          },
          {
            $project: {
              name: 1,
              description: 1,
              price: 1,
              oldPrice: 1,
              images: 1,
              sizes: 1,
              colors: 1,
              stock: 1,
              rating: 1,
              numReviews: 1,
              createdAt: 1,
              updatedAt: 1,
              "category._id": 1,
              "category.name": 1,
              "category.slug": 1,
            },
          },
        ],
        totalCount: [{ $count: "total" }],
      },
    },
  ]);

  return {
    products: result.data.map(withDiscountPercent),
    total: result.totalCount[0]?.total || 0,
  };
};

const getPublicProductById = async (id) => {
  const product = await Product.findById(id)
    .populate("category", "name slug")
    .lean();

  if (!product) throw new AppError("Product not found.", 404);

  return withDiscountPercent(product);
};

module.exports = { getPublicProducts, getPublicProductById };
