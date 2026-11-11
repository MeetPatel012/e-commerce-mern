const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/productModel");

dotenv.config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const products = [
  {
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "Electronics",
    stock: 50,
    description: "Premium wireless headphones with active noise cancellation, 30-hour battery life, and crystal-clear sound for music, calls, and gaming.",
  },
  {
    name: "Running Sneakers",
    price: 129.99,
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    category: "Footwear",
    stock: 30,
    description: "Lightweight running sneakers with responsive cushioning, breathable mesh upper, and durable rubber outsole for long-distance comfort.",
  },
  {
    name: "Cotton T-Shirt",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "Clothing",
    stock: 100,
    description: "Soft 100% cotton t-shirt with a classic fit. Available in multiple colors, perfect for everyday casual wear.",
  },
  {
    name: "Laptop Stand",
    price: 45.99,
    imageUrl: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
    category: "Electronics",
    stock: 40,
    description: "Adjustable aluminum laptop stand that raises your screen to eye level, reducing neck strain. Folds flat for easy transport.",
  },
  {
    name: "Coffee Maker",
    price: 89.99,
    imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400",
    category: "Home & Kitchen",
    stock: 25,
    description: "Brew café-quality coffee at home with this programmable coffee maker. Features a thermal carafe, timer, and auto-shutoff.",
  },
  {
    name: "Yoga Mat",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    category: "Sports",
    stock: 60,
    description: "Non-slip eco-friendly yoga mat with extra cushioning for joints. Lightweight and easy to carry to your next class.",
  },
  {
    name: "Backpack",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    category: "Accessories",
    stock: 45,
    description: "Durable everyday backpack with padded laptop compartment, multiple pockets, and water-resistant fabric for work or travel.",
  },
  {
    name: "Desk Lamp",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
    category: "Home & Kitchen",
    stock: 35,
    description: "Modern LED desk lamp with adjustable brightness and color temperature. USB charging port and touch controls included.",
  },
  {
    name: "Smart Watch",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    category: "Electronics",
    stock: 25,
    description: "Feature-rich smartwatch with heart rate monitor, GPS, sleep tracking, and smartphone notifications. Water-resistant design.",
  },
  {
    name: "Bluetooth Speaker",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1606820628900-e0ca791ca7b7?w=400",
    category: "Electronics",
    stock: 40,
    description: "Portable waterproof Bluetooth speaker with deep bass, 12-hour battery life, and hands-free voice assistant support.",
  },
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