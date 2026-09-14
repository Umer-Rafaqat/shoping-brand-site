const Joi = require("joi");

const addCartItemSchema = Joi.object({
  productId: Joi.string().required().messages({
    "string.empty": "Product is required.",
    "any.required": "Product is required.",
  }),
  size: Joi.string().allow("").optional(),
  color: Joi.string().allow("").optional(),
  quantity: Joi.number().integer().min(1).optional().messages({
    "number.base": "Quantity must be at least 1.",
    "number.integer": "Quantity must be at least 1.",
    "number.min": "Quantity must be at least 1.",
  }),
});

const updateCartItemSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "Quantity must be at least 1.",
    "number.integer": "Quantity must be at least 1.",
    "number.min": "Quantity must be at least 1.",
    "any.required": "Quantity is required.",
  }),
});

module.exports = { addCartItemSchema, updateCartItemSchema };
