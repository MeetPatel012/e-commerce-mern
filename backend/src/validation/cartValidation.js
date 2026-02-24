const { body, validationResult } = require("express-validator");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const addToCartValidation = [
  body("productId").notEmpty().withMessage("Product ID is required"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  validateRequest
];

module.exports = { addToCartValidation };