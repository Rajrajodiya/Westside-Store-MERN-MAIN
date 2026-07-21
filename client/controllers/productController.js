const Product = require("../models/Product");

exports.search = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    if (!q || q.trim().length === 0)
      return res.status(400).json({ status: "error", message: "Search query is required" });

    const filter = { $text: { $search: q } };
    if (category) filter.category = category.toLowerCase();
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const results = await Product.find(filter, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } }).limit(20);
    res.json({ status: "success", count: results.length, results });
  } catch (error) {
    console.error("Product search error:", error);
    res.status(500).json({ status: "error", message: "Search failed" });
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category.toLowerCase() }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findOne({ category: req.params.category.toLowerCase(), _id: req.params.id });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Fetch product error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};
