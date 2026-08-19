const express = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/admin.controller");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/authorize");
const {
  validate,
  adminUpdateUserRules,
  adminCreateUserRules,
} = require("../middleware/validate");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", adminCreateUserRules, validate, createUser);
router.put("/users/:id", adminUpdateUserRules, validate, updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
