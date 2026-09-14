const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllCartActivity,
} = require("../controllers/admin.controller");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const {
  getAllCategories,
  createCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const { upload, normalizeProductArrays } = require("../middleware/upload");
const { validate } = require("../middleware/validate");
const {
  adminUpdateUserSchema,
  adminCreateUserSchema,
} = require("../validations/admin.validation");
const { productSchema } = require("../validations/product.validation");
const { categorySchema } = require("../validations/category.validation");

const router = express.Router();

router.use(protect, authorize("admin"));

// ─── Users ──────────────────────────────────────────────────────────────────────
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", validate(adminCreateUserSchema), createUser);
router.put("/users/:id", validate(adminUpdateUserSchema), updateUser);
router.delete("/users/:id", deleteUser);

// ─── Products ───────────────────────────────────────────────────────────────────
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post(
  "/products",
  upload.array("images", 5),
  normalizeProductArrays,
  validate(productSchema),
  createProduct,
);
router.put(
  "/products/:id",
  upload.array("images", 5),
  normalizeProductArrays,
  validate(productSchema),
  updateProduct,
);
router.delete("/products/:id", deleteProduct);

// ─── Categories ─────────────────────────────────────────────────────────────────
router.get("/categories", getAllCategories);
router.post("/categories", validate(categorySchema), createCategory);
router.delete("/categories/:id", deleteCategory);

// ─── Cart Activity ────────────────────────────────────────────────────────────
router.get("/carts", getAllCartActivity);

module.exports = router;
