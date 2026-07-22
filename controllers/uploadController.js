const multer = require("multer");
const path = require("path");
const asyncHandler = require("../utils/asyncHandler");
const respond = require("../utils/respond");
const AppError = require("../utils/AppError");

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "/tmp"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

exports.upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) return cb(null, true);
    cb(new AppError(400, `Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, AVIF`));
  },
  limits: { fileSize: MAX_FILE_SIZE },
});

exports.uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) throw AppError.badRequest("No file uploaded");
  respond.created(res, {
    url: `/api/uploads/${req.file.filename}`,
    filename: req.file.filename,
    size: req.file.size,
  });
});

exports.uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0)
    throw AppError.badRequest("No files uploaded");

  const files = req.files.map((f) => ({
    url: `/api/uploads/${f.filename}`, filename: f.filename, size: f.size,
  }));
  respond.created(res, { files });
});
