const { body, validationResult } = require("express-validator");

const emailRule = body("email")
  .trim()
  .notEmpty()
  .withMessage("Email is required. ")
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
  body("password").notEmpty().withMessage("Enter your password to confirm "),
];

module.exports = {
  validate,
  signupRules,
  loginRules,
  updateProfileRules,
  changePasswordRules,
  deleteAccountRules,
};
