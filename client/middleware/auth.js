const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "westside-store-jwt-secret-key-2026";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ status: "error", message: "Access denied. No token provided." });
  try {
    req.user = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ status: "error", message: "Invalid or expired token." });
  }
};

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try { req.user = jwt.verify(authHeader.split(" ")[1], JWT_SECRET); } catch {}
  }
  next();
};

module.exports = { authMiddleware, optionalAuth, JWT_SECRET };
