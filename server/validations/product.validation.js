const Joi = require("joi");

// Matches MongoDB's ObjectId format (24 hex characters).
const objectId = Joi.string().pattern(/^[0-9a-fA-F]{24}$/);

const productSchema = Joi.object({
  name: Joi.string().trim().max(120).required().messages({
    "string.empty": "Product name is required.",
    "string.max": "Product name cannot exceed 120 characters.",
    "any.required": "Product name is required.",
  }),
  description: Joi.string().trim().max(2000).required().messages({
    "string.empty": "Description is required.",
    "string.max": "Description cannot exceed 2000 characters.",
    "any.required": "Description is required.",
  }),
  price: Joi.number().min(0).required().messages({
    "number.base": "Price must be a positive number.",
    "number.min": "Price must be a positive number.",
    "any.required": "Price is required.",
  }),
  oldPrice: Joi.number().min(0).allow(null, "").optional().messages({
    "number.base": "Old price must be a positive number.",
    "number.min": "Old price must be a positive number.",
  }),
  category: objectId.required().messages({
    "string.pattern.base": "Invalid category.",
    "any.required": "Category is required.",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "Stock must be a non-negative whole number.",
    "number.integer": "Stock must be a non-negative whole number.",
    "number.min": "Stock must be a non-negative whole number.",
    "any.required": "Stock is required.",
  }),
  images: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Images must be a list of URLs.",
  }),
  sizes: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Sizes must be a list.",
  }),
  colors: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Colors must be a list.",
  }),
});

module.exports = { productSchema };
