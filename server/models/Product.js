const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [120, "Product name cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price can't be negative"],
      index: true,
    },
    oldPrice: {
      type: Number,
      min: [0, "Old price can't be negative"],
      default: null,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true, // speeds up filtering products by category
    },
    sizes: {
      type: [String],
      default: [],
    },
    colors: {
      type: [String],
      default: [],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock can't be negative"],
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Speeds up the default "newest" sort and any date-range queries.
productSchema.index({ createdAt: -1 });

// Speeds up exact/prefix name lookups and lets MongoDB use an index for sorting by name.
// Note: our current search uses an unanchored regex ($regex: search, no "^"), which matches
// the term anywhere in the string (e.g. "shirt" matches "T-Shirt"). MongoDB cannot use a
// normal index for that kind of "contains" search — only for prefix (^) matches. This index
// still helps name-based sorting and exact/prefix lookups; true fast "contains" search at
// scale needs a text index (word-based, not substring) or a dedicated search engine (e.g.
// MongoDB Atlas Search) — worth adding later if the catalog grows large.
productSchema.index({ name: 1 });

productSchema.virtual("discountPercent").get(function () {
  if (!this.oldPrice || this.oldPrice <= this.price) return 0;
  return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
