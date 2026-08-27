const express = require("express");
const {
  getPublicProducts,
  getPublicProductById,
} = require("../controllers/publicProduct.controller");

const router = express.Router();

router.get("/", getPublicProducts);
router.get("/:id", getPublicProductById);

module.exports = router;
