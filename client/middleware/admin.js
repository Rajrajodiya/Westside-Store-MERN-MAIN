const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "westside-store-jwt-secret-key-2026";

const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ status: "error", message: "Access denied. No token provided." });
  try {
    const decoded = jwt.verify(authHeader.split(" ")[1], JWT_SECRET);
    if (!decoded.isAdmin) return res.status(403).json({ status: "error", message: "Access denied. Admin privileges required." });
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ status: "error", message: "Invalid or expired admin token." });
  }
};

module.exports = adminMiddleware;
