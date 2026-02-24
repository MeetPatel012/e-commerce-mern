const Cart = require("../models/cartModel")
const Product = require("../models/productModel");
const asyncHandler = require("../utils/asyncHandler")

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [{ product: productId, quantity }]
    });
  } else {
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
  }

  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  res.json({ success: true, data: populatedCart });
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.find(
    item => item.product.toString() === productId
  );

  if (!item) {
    res.status(404);
    throw new Error("Product not in cart");
  }

  item.quantity = quantity;
  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  res.json({ success: true, data: populatedCart });
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate("items.product");
  res.json({ success: true, data: populatedCart });
});

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("items.product");

  res.json({ success: true, data: cart });
});

module.exports = {
  addToCart,
  updateCartItem,
  removeCartItem,
  getCart
};