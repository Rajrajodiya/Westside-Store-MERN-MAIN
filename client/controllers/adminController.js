const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// ─── Products ───────────────────────────────────────────────────────

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ status: "success", count: products.length, products });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch products" });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { imageName, brand, mainImage, otherImages, mrp, price, description, category } = req.body;
    if (!imageName || !mainImage || !mrp || !price || !category)
      return res.status(400).json({ status: "error", message: "Required: imageName, mainImage, mrp, price, category" });
    const product = new Product({ imageName, brand: brand || "", mainImage, otherImages: otherImages || [], mrp, price, description: description || "", category: category.toLowerCase() });
    await product.save();
    res.status(201).json({ status: "success", product });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to create product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const updates = {};
    ["imageName", "brand", "mainImage", "otherImages", "mrp", "price", "description", "category"].forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = f === "category" ? req.body[f].toLowerCase() : req.body[f];
    });
    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ status: "error", message: "Product not found" });
    res.json({ status: "success", product });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ status: "error", message: "Product not found" });
    res.json({ status: "success", message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to delete product" });
  }
};

// ─── Orders ─────────────────────────────────────────────────────────

exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { status } : {};
    const orders = await Order.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Order.countDocuments(query);
    res.json({ status: "success", orders, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch orders" });
  }
};

// ─── Users ──────────────────────────────────────────────────────────

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ status: "success", count: users.length, users });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Failed to fetch users" });
  }
};
