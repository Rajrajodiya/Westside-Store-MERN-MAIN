const jwt = require("jsonwebtoken");
const AppError = require("./AppError");

const JWT_SECRET = process.env.JWT_SECRET || "westside-store-jwt-secret-key-2026";

const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw AppError.unauthorized("Access denied. No token provided.");
  return authHeader.split(" ")[1];
};

const verifyToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = { extractToken, verifyToken, JWT_SECRET };
