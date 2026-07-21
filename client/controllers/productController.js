const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");
const respond = require("../utils/respond");
const validate = require("../utils/validate");
const AppError = require("../utils/AppError");

// ── Query builder (normalization at boundary) ─────────────────────

const buildSearchFilter = ({ q, category, minPrice, maxPrice }) => {
  if (!q || !q.trim()) throw AppError.badRequest("Search query is required");
  const filter = { $text: { $search: q.trim() } };
  if (category) filter.category = category.toLowerCase().trim();
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }
  return filter;
};

// ── Exports ────────────────────────────────────────────────────────

exports.search = asyncHandler(async (req, res) => {
  const filter = buildSearchFilter(req.query);
  const results = await Product.find(filter, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(20);
  respond.list(res, results);
});

exports.getByCategory = asyncHandler(async (req, res) => {
  const category = req.params.category.toLowerCase().trim();
  const products = await Product.find({ category }).sort({ createdAt: -1 });
  respond.list(res, products);
});

exports.getById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    category: req.params.category.toLowerCase().trim(),
    _id: req.params.id,
  });
  if (!product) throw AppError.notFound("Product not found");
  respond.success(res, product);
});
