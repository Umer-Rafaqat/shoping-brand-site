const Joi = require("joi");

const categorySchema = Joi.object({
  name: Joi.string().trim().max(40).required().messages({
    "string.empty": "Category name is required.",
    "string.max": "Category name cannot exceed 40 characters.",
    "any.required": "Category name is required.",
  }),
});

module.exports = { categorySchema };
