const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/search", productController.search);
router.get("/:category", productController.getByCategory);
router.get("/:category/:id", productController.getById);

module.exports = router;
