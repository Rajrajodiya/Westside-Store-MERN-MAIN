const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  imageName: String,
  brand: String,
  mainImage: String,
  otherImages: [String],
  mrp: Number,
  price: Number,
  description: String,
  category: String // "women" or "men"
});
const Product = mongoose.model("Product", ProductSchema);

router.get("/:category", async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category });
  res.json(products);
});

router.get("/:category/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      category: req.params.category,
      _id: req.params.id
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
