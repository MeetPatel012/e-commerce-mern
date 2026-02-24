const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { productValidation } = require("../validation/productValidation");

router.post("/", protect, productValidation, createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, productValidation, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
