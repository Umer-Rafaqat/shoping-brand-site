const Joi = require("joi");

const verifyPaymentParamsSchema = Joi.object({
  orderId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid order ID.",
      "any.required": "Order ID is required.",
    }),
});

module.exports = { verifyPaymentParamsSchema };
