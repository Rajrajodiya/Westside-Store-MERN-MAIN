const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/uploadController");
const { authMiddleware } = require("../middleware/auth");

router.post("/", authMiddleware, uploadController.upload.single("image"), uploadController.uploadSingle);
router.post("/multiple", authMiddleware, uploadController.upload.array("images", 5), uploadController.uploadMultiple);

module.exports = router;
