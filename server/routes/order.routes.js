const express = require("express");
const {
  createOrder,
  getMyOrders,
  getMyOrderById,
  cancelMyOrder,
} = require("../controllers/order.controller");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const { createOrderSchema } = require("../validations/order.validation");

const router = express.Router();

// Any logged-in user manages their own orders only.
router.use(protect);

router.post("/", validate(createOrderSchema), createOrder);
router.get("/", getMyOrders);
router.get("/:id", getMyOrderById);
router.put("/:id/cancel ", cancelMyOrder);

module.exports = router;
