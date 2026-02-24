const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/productModel");

dotenv.config();

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "Electronics",
    stock: 50
  },
  {
    name: "Running Sneakers",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "Footwear",
    stock: 30
  },
  {
    name: "Cotton T-Shirt",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "Clothing",
    stock: 100
  },
  {
    name: "Laptop Stand",
    price: 45.99,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    category: "Electronics",
    stock: 40
  },
  {
    name: "Coffee Maker",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
    category: "Home & Kitchen",
    stock: 25
  },
  {
    name: "Yoga Mat",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    category: "Sports",
    stock: 60
  },
  {
    name: "Backpack",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    category: "Accessories",
    stock: 45
  },
  {
    name: "Desk Lamp",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
    category: "Home & Kitchen",
    stock: 35
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("MongoDB Connected");

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`${products.length} products seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();
