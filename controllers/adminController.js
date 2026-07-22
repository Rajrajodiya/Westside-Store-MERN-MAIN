const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const respond = require("../utils/respond");
const validate = require("../utils/validate");
const AppError = require("../utils/AppError");

// ── Helpers ────────────────────────────────────────────────────────

const PRODUCT_FIELDS = ["imageName", "brand", "mainImage", "otherImages", "mrp", "price", "description", "category"];

const normalizeProduct = (body) => {
  const data = validate.normalize(body, PRODUCT_FIELDS);
  if (data.otherImages && !Array.isArray(data.otherImages)) data.otherImages = [data.otherImages];
  if (data.category) data.category = data.category.toLowerCase();
  return data;
};

// ── Products ───────────────────────────────────────────────────────

exports.getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  respond.list(res, products, { count: products.length });
});

exports.createProduct = asyncHandler(async (req, res) => {
  const data = normalizeProduct(req.body);
  validate.required(data, ["imageName", "mainImage", "mrp", "price", "category"]);

  const product = await Product.create(data);
  respond.created(res, { product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const data = normalizeProduct(req.body);
  // Only include provided fields
  const updates = {};
  for (const f of PRODUCT_FIELDS) {
    if (data[f] !== undefined) updates[f] = data[f];
  }

  const product = await Product.findByIdAndUpdate(req.params.id, updates, {
    new: true, runValidators: true,
  });
  if (!product) throw AppError.notFound("Product not found");
  respond.success(res, { product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw AppError.notFound("Product not found");
  respond.success(res, { message: "Product deleted" });
});

// ── Orders ─────────────────────────────────────────────────────────

exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const [orders, total] = await Promise.all([
    Order.find(query).sort({ createdAt: -1 })
      .skip((page - 1) * limit).limit(parseInt(limit)),
    Order.countDocuments(query),
  ]);
  respond.list(res, orders, { total, page: parseInt(page), pages: Math.ceil(total / limit) });
});

// ── Users ──────────────────────────────────────────────────────────

exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  respond.list(res, users, { count: users.length });
});
