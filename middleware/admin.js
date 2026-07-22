const { extractToken, verifyToken } = require("../utils/token");
const AppError = require("../utils/AppError");

const adminMiddleware = (req, res, next) => {
  try {
    const decoded = verifyToken(extractToken(req.headers.authorization));
    if (!decoded.isAdmin) throw AppError.forbidden("Access denied. Admin privileges required.");
    req.admin = decoded;
    next();
  } catch (err) {
    if (err.isOperational) {
      const status = err.statusCode || 403;
      return res.status(status).json(err);
    }
    return res.status(401).json({ status: "error", message: "Invalid or expired admin token." });
  }
};

module.exports = adminMiddleware;
