const express = require("express");
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
} = require("../controllers/cart.controller");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
  addCartItemSchema,
  updateCartItemSchema,
} = require("../validations/cart.validation");

const router = express.Router();

// Any logged-in user (not admin-only) can manage their own cart.
router.use(protect);

router.get("/", getCart);
router.post("/", validate(addCartItemSchema), addItem);
router.put("/:itemId", validate(updateCartItemSchema), updateItem);
router.delete("/:itemId", removeItem);

module.exports = router;
