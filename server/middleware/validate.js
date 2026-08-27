const { body, validationResult } = require("express-validator");

const emailRule = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required.")
  .isEmail()
  .withMessage("Enter a valid email address.")
  .normalizeEmail();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

const signupRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 60 })
    .withMessage("Name cannot exceed 60 characters."),
  emailRule,
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

const loginRules = [
  emailRule,
  body("password").notEmpty().withMessage("Password is required."),
];

// ─── Account (My Account page) ────────────────────────────────────────────────

const updateProfileRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 60 })
    .withMessage("Name cannot exceed 60 characters."),
  emailRule,
];

const adminProfileRules = [
  body("name").trim().notEmpty().withMessage("Name is required.").isLength({ max: 60 }).withMessage("Name cannot exceed 60 characters."),
  body("username").trim().notEmpty().withMessage("Username is required.").isLength({ min: 3, max: 30 }).withMessage("Username must be 3 to 30 characters.").matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores."),
];

const changePasswordRules = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Enter your current password."),
  body("newPassword")
    .notEmpty()
    .withMessage("Enter a new password.")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters.")
    .custom((value, { req }) => value !== req.body.currentPassword)
    .withMessage("New password must be different from the current one."),
];

const deleteAccountRules = [
  body("password").notEmpty().withMessage("Enter your password to confirm."),
];

// ─── Admin: edit another user's profile ───────────────────────────────────────
const adminUpdateUserRules = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty.")
    .isLength({ max: 60 })
    .withMessage("Name cannot exceed 60 characters."),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Enter a valid email address.")
    .normalizeEmail(),
];

// ─── Admin: create a new user ──────────────────────────────────────────────────

const adminCreateUserRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 60 })
    .withMessage("Name cannot exceed 60 characters."),
  emailRule,
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

// ─── Admin: products ────────────────────────────────────────────────────────────
const productRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required.")
    .isLength({ max: 120 })
    .withMessage("Product name cannot exceed 120 characters."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("oldPrice")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("Old price must be a positive number."),

  body("category")
    .notEmpty()
    .withMessage("Category is required.")
    .isMongoId()
    .withMessage("Invalid category."),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative whole number."),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be a list of URLs."),
  body("sizes").optional().isArray().withMessage("Sizes must be a list."),
  body("colors").optional().isArray().withMessage("Colors must be a list."),
];

// ─── Admin: categories ──────────────────────────────────────────────────────────
const categoryRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ max: 40 })
    .withMessage("Category name cannot exceed 40 characters."),
];

module.exports = {
  validate,
  signupRules,
  loginRules,
  updateProfileRules,
  adminProfileRules,
  changePasswordRules,
  deleteAccountRules,
  adminUpdateUserRules,
  adminCreateUserRules,
  productRules,
  categoryRules,
};
