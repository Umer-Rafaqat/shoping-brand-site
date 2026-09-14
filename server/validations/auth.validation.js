const Joi = require("joi");

const nameField = Joi.string().trim().max(60).required().messages({
  "string.empty": "Name is required.",
  "string.max": "Name cannot exceed 60 characters.",
  "any.required": "Name is required.",
});

const emailField = Joi.string().trim().email().required().messages({
  "string.empty": "Email is required.",
  "string.email": "Enter a valid email address.",
  "any.required": "Email is required.",
});

const passwordField = (min = 8) =>
  Joi.string()
    .min(min)
    .required()
    .messages({
      "string.empty": "Password is required.",
      "string.min": `Password must be at least ${min} characters.`,
      "any.required": "Password is required.",
    });

const signupSchema = Joi.object({
  name: nameField,
  email: emailField,
  password: passwordField(),
});

const loginSchema = Joi.object({
  email: emailField,
  password: Joi.string().required().messages({
    "string.empty": "Password is required.",
    "any.required": "Password is required.",
  }),
});

const updateProfileSchema = Joi.object({
  name: nameField,
  email: emailField,
});

const adminProfileSchema = Joi.object({
  name: nameField,
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.empty": "Username is required.",
      "string.min": "Username must be 3 to 30 characters.",
      "string.max": "Username must be 3 to 30 characters.",
      "string.pattern.base":
        "Username can only contain letters, numbers, and underscores.",
      "any.required": "Username is required.",
    }),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Enter your current password.",
    "any.required": "Enter your current password.",
  }),
  newPassword: Joi.string()
    .min(8)
    .required()
    .invalid(Joi.ref("currentPassword"))
    .messages({
      "string.empty": "Enter a new password.",
      "string.min": "New password must be at least 8 characters.",
      "any.required": "Enter a new password.",
      "any.invalid": "New password must be different from the current one.",
    }),
});

const deleteAccountSchema = Joi.object({
  password: Joi.string().required().messages({
    "string.empty": "Enter your password to confirm.",
    "any.required": "Enter your password to confirm.",
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
  updateProfileSchema,
  adminProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
};
