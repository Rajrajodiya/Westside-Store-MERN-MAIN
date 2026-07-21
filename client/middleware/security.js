const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false,
  message: { status: "error", message: "Too many requests. Please try again later." },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false,
  message: { status: "error", message: "Too many login/signup attempts. Please try again after 15 minutes." },
});
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 5, standardHeaders: true, legacyHeaders: false,
  message: { status: "error", message: "Too many submissions. Please try again later." },
});
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, max: 10, standardHeaders: true, legacyHeaders: false,
  message: { status: "error", message: "Too many orders placed. Please try again later." },
});
const sanitizeMongo = mongoSanitize();
const sanitizeXss = xssClean();

module.exports = { generalLimiter, authLimiter, contactLimiter, orderLimiter, sanitizeMongo, sanitizeXss };
