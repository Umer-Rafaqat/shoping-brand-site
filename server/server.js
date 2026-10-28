require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const path = require("path");
const multer = require("multer");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const { stripeWebhook } = require("./controllers/payment.controller");

const app = express();

// ─── Security middleware ──────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

// ─── Stripe Webhook ───────────────────────────────────────────────────────────
// Stripe signs the RAW body, so this route must come BEFORE express.json().
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

// ─── Body / cookie parsing ────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/assets", express.static(path.join(__dirname, "assets")));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    message: `Route ${req.originalUrl} not found.`,
  });
});

// ─── Global error handler ─────────────────────────────────────────────────────
// catchAsync forwards every service/controller error here.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_UNEXPECTED_FIELD: `Unexpected upload field "${err.field}". Use "images" as the field name.`,
      LIMIT_FILE_SIZE: "Each image must be 5MB or smaller.",
      LIMIT_FILE_COUNT: "You can upload at most 5 images.",
    };

    return res.status(400).json({
      message: messages[err.code] || "There was a problem with your upload.",
    });
  }

  const statusCode = err.statusCode || err.status || 500;

  if (!err.isOperational) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    message: err.isOperational ? err.message : "Server error. Try again.",
  });
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
});
