const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, default: "" },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
  },
  { _id: false },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_METHODS = ["COD", "STRIPE"];
const PAYMENT_STATUSES = ["unpaid", "paid", "failed", "refunded"];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: Number, required: true, unique: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "An order must have at least one item.",
      },
    },

    shippingAddress: { type: shippingAddressSchema, required: true },

    subtotal: { type: Number, required: true, min: 0 },

    deliveryFee: { type: Number, required: true, min: 0 },

    discountAmount: { type: Number, default: 0, min: 0 },

    couponCode: { type: String, default: null },

    totalAmount: { type: Number, required: true, min: 0 },

    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "unpaid",
    },

    stripeSessionId: {
      type: String,
      default: null,
      index: true,
    },

    stripePaymentIntentId: {
      type: String,
      default: null,
    },

    paidAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
    },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Order", orderSchema);
module.exports.ORDER_STATUSES = ORDER_STATUSES;
