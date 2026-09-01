const Product = require("../models/Product");
const Category = require("../models/Category");
const mongoose = require("mongoose");

// .lean() skips Mongoose's document wrapping (change tracking, virtuals, getters/setters)
// and returns plain JS objects instead — much lighter and faster when we're only reading
// data to send as JSON and never saving it back. Since lean() also skips virtuals, we
// compute discountPercent manually below to keep the API response unchanged.
const withDiscountPercent = (product) => {
  const { oldPrice, price } = product;
  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;
  return { ...product, discountPercent };
};

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
      let categoryDocument = await Category.findOne({ slug: category })
        .select("_id")
        .lean();
      if (!categoryDocument && mongoose.isValidObjectId(category)) {
        categoryDocument = await Category.findById(category)
          .select("_id")
          .lean();
      }

      if (!categoryDocument) {
        return res.status(200).json({
          message: "Products fetched successfully.",
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

    const sortOrder =
      sort === "priceAsc"
        ? { price: 1, createdAt: -1 }
        : sort === "priceDesc"
          ? { price: -1, createdAt: -1 }
          : sort === "topSelling"
            ? { numReviews: -1, rating: -1, createdAt: -1 }
            : { createdAt: -1 };

    // $facet runs the paginated "data" pipeline and the "total count" pipeline
    // in a single aggregation call — one round trip to MongoDB instead of two
    // separate queries (find + countDocuments) racing over the network.
    const [result] = await Product.aggregate([
      { $match: filter },
      {
        $facet: {
          data: [
            { $sort: sortOrder },
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

    const products = result.data.map(withDiscountPercent);
    const total = result.totalCount[0]?.total || 0;

    return res.status(200).json({
      message: "Products fetched successfully.",
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
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    return res.status(200).json({
      message: "Product fetched successfully.",
      product: withDiscountPercent(product),
    });
  } catch (err) {
    console.error("getPublicProductById error:", err);
    return res.status(500).json({ message: "Server error. Try again." });
  }
};

module.exports = { getPublicProducts, getPublicProductById };
