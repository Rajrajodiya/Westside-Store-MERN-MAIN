const multer = require("multer");
const path = require("path");

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
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Invalid file type: ${file.mimetype}. Allowed: JPEG, PNG, WebP, AVIF`), false);
  },
  limits: { fileSize: MAX_FILE_SIZE },
});

exports.uploadSingle = (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ status: "error", message: "No file uploaded" });
    res.status(201).json({ status: "success", url: `/api/uploads/${req.file.filename}`, filename: req.file.filename, size: req.file.size });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.uploadMultiple = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ status: "error", message: "No files uploaded" });
    const files = req.files.map((f) => ({ url: `/api/uploads/${f.filename}`, filename: f.filename, size: f.size }));
    res.status(201).json({ status: "success", files });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
