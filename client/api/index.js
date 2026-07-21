const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config({ path: path.join(__dirname, "..", "..", ".env") });

const connectDB = require("./config/db");

const authRoutes = require("../routes/auth");
const productRoutes = require("../routes/products");
const orderRoutes = require("../routes/orders");
const contactRoutes = require("../routes/contact");
const paymentRoutes = require("../routes/payment");
const uploadRoutes = require("../routes/upload");
const adminRoutes = require("../routes/admin");
const { authMiddleware } = require("../middleware/auth");
const { generalLimiter, authLimiter, contactLimiter, orderLimiter, sanitizeMongo, sanitizeXss } = require("../middleware/security");

const app = express();

// ─── Security & Headers ─────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(generalLimiter);

// ─── Stripe webhook MUST use raw body BEFORE express.json() ─────────
app.use("/api/payment", (req, res, next) => {
  if (req.path === "/webhook") {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});
app.use("/api/payment", paymentRoutes);

// ─── Body Parsing (all other routes) ───────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Input Sanitizers ───────────────────────────────────────────────
app.use(sanitizeMongo);
app.use(sanitizeXss);

// ─── Logging ────────────────────────────────────────────────────────
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── API Routes ─────────────────────────────────────────────────────
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/contact", contactLimiter, contactRoutes);
app.use("/api/orders", orderLimiter, orderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);

// Protected auth route
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });
    res.json({ status: "success", user: user.toJSON() });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler (Express 5 compatible — wildcard syntax changed)
app.use("/api/", (req, res) => {
  res.status(404).json({ status: "error", message: "API endpoint not found" });
});

// Global error handler — catches AppError + unexpected errors
app.use((err, req, res, next) => {
  // AppError — known operational failures
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      ...(err.meta ? { meta: err.meta } : {}),
    });
  }
  // Programming / unknown errors — log and return generic message
  console.error("Unhandled error:", err);
  res.status(500).json({ status: "error", message: "Internal server error" });
});

// ─── Vercel Serverless Export ───────────────────────────────────────
let connected = false;
const handler = async (req, res) => {
  if (!connected) {
    try { await connectDB(); connected = true; }
    catch (err) { console.error("MongoDB connection failed:", err.message); }
  }
  return app(req, res);
};

module.exports = handler;

// ─── Local Development Server ────────────────────────────────────────
// When run directly (node api/index.js or via require.main === module)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  (async () => {
    try {
      await connectDB();
      app.listen(PORT, () => {
        console.log(`\n⚡ WestSide Store API Server`);
        console.log(`   🚀  http://localhost:${PORT}`);
        console.log(`   📡  http://localhost:${PORT}/api/health`);
        console.log(`   📦  MongoDB: Connected\n`);
      });
    } catch (err) {
      console.error("❌ Failed to start server:", err.message);
      process.exit(1);
    }
  })();
}
