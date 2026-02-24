const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware")
const {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart
} = require("../controllers/cartController")
const { addToCartValidation } = require("../validation/cartValidation")

router.post("/add", protect, addToCartValidation, addToCart);
router.put("/update/:productId", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeCartItem);
router.get("/", protect, getCart);

module.exports = router;