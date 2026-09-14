const mongoose = require("mongoose");

// Each line item is its own subdocument (auto-gets its own `_id`), which is
// what the frontend uses to target a specific line for update/remove — this
// matters because the same product with a different size/color is a
// separate line, not a merge.
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1."],
      default: 1,
    },
  },
  { timestamps: true },
);

// One Cart document per user — `unique: true` on `user` guarantees this at
// the database level, so we never end up with two carts for the same person.
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Cart", cartSchema);
