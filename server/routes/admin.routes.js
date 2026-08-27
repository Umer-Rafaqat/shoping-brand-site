const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
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
const {
  validate,
  adminUpdateUserRules,
  adminCreateUserRules,
  productRules,
  categoryRules,
} = require("../middleware/validate");

const router = express.Router();

router.use(protect, authorize("admin"));

// ─── Users ──────────────────────────────────────────────────────────────────────
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", adminCreateUserRules, validate, createUser);
router.put("/users/:id", adminUpdateUserRules, validate, updateUser);
router.delete("/users/:id", deleteUser);

// ─── Products ───────────────────────────────────────────────────────────────────
router.get("/products", getAllProducts);
router.get("/products/:id", getProductById);
router.post("/products", upload.array("images", 5), normalizeProductArrays, productRules, validate, createProduct);
router.put("/products/:id", upload.array("images", 5), normalizeProductArrays, productRules, validate, updateProduct);
router.delete("/products/:id", deleteProduct);

// ─── Categories ─────────────────────────────────────────────────────────────────
router.get("/categories", getAllCategories);
router.post("/categories", categoryRules, validate, createCategory);
router.delete("/categories/:id", deleteCategory);

module.exports = router;
