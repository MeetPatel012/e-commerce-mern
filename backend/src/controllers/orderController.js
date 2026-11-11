const Order = require("../models/orderModel")
const Cart = require("../models/cartModel")
const Product = require("../models/productModel")
const asyncHandler = require("../utils/asyncHandler")

const createOrder = asyncHandler(async (req, res) => {
  const {
    shippingAddress,
    paymentMethod,
    paymentResult,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body

  const cart = await Cart.findOne({ user: req.user._id }).populate("items.product")

  if (!cart || cart.items.length === 0) {
    res.status(400)
    throw new Error("No items in cart")
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    imageUrl: item.product.imageUrl,
  }))

  const order = await Order.create({
    user: req.user._id,
    orderItems: orderItems,
    shippingAddress,
    paymentMethod,
    paymentResult,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: true,
    paidAt: new Date(),
    isDelivered: false,
  })

  await Cart.findOneAndDelete({ user: req.user._id })

  res.status(201).json({ success: true, data: order })
})

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 })
  res.json({ success: true, data: orders })
})

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (!order) {
    res.status(404)
    throw new Error("Order not found")
  }

  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("Not authorized to view this order")
  }

  res.json({ success: true, data: order })
})

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
}
