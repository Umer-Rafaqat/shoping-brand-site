const Joi = require("joi");

// Admin editing another user's name/email — both optional (partial update),
// but if provided, still must be valid.
const adminUpdateUserSchema = Joi.object({
  name: Joi.string().trim().max(60).messages({
    "string.empty": "Name cannot be empty.",
    "string.max": "Name cannot exceed 60 characters.",
  }),
  email: Joi.string().trim().email().messages({
    "string.email": "Enter a valid email address.",
  }),
});

const adminCreateUserSchema = Joi.object({
  name: Joi.string().trim().max(60).required().messages({
    "string.empty": "Name is required.",
    "string.max": "Name cannot exceed 60 characters.",
    "any.required": "Name is required.",
  }),
  email: Joi.string().trim().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Enter a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Password is required.",
    "string.min": "Password must be at least 8 characters.",
    "any.required": "Password is required.",
  }),
});

module.exports = { adminUpdateUserSchema, adminCreateUserSchema };
