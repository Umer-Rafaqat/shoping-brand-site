const Joi = require("joi");
const { ORDER_STATUSES } = require("../models/Order");

const shippingAddressSchema = Joi.object({
  fullName: Joi.string().trim().max(80).required().messages({
    "string.empty": "Full name is required.",
    "any.required": "Full name is required.",
  }),
  phone: Joi.string().trim().min(7).max(20).required().messages({
    "string.empty": "Phone number is required.",
    "string.min": "Enter a valid phone number.",
    "any.required": "Phone number is required.",
  }),
  addressLine: Joi.string().trim().max(200).required().messages({
    "string.empty": "Address is required.",
    "any.required": "Address is required.",
  }),
  city: Joi.string().trim().max(60).required().messages({
    "string.empty": "City is required.",
    "any.required": "City is required.",
  }),
  postalCode: Joi.string().trim().max(20).required().messages({
    "string.empty": "Postal code is required.",
    "any.required": "Postal code is required.",
  }),
});

const createOrderSchema = Joi.object({
  shippingAddress: shippingAddressSchema.required(),
});

const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...ORDER_STATUSES)
    .required()
    .messages({
      "any.only": `Status must be one of: ${ORDER_STATUSES.join(", ")}.`,
      "any.required": "Status is required.",
    }),
});

module.exports = { createOrderSchema, updateOrderStatusSchema };
