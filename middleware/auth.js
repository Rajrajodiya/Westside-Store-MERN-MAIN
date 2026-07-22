const { extractToken, verifyToken, JWT_SECRET } = require("../utils/token");

const authMiddleware = (req, res, next) => {
  try {
    req.user = verifyToken(extractToken(req.headers.authorization));
    next();
  } catch (err) {
    if (err.isOperational) return res.status(401).json(err);
    return res.status(401).json({ status: "error", message: "Invalid or expired token." });
  }
};

const optionalAuth = (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    req.user = jwt.verify(token, JWT_SECRET);
  } catch {
    // Silently continue without auth — optional
  }
  next();
};

module.exports = { authMiddleware, optionalAuth, JWT_SECRET };
