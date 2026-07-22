const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const adminMiddleware = require("../middleware/admin");

router.use(adminMiddleware);

router.get("/products", adminController.getAllProducts);
router.post("/products", adminController.createProduct);
router.put("/products/:id", adminController.updateProduct);
router.delete("/products/:id", adminController.deleteProduct);
router.get("/orders", adminController.getAllOrders);
router.get("/users", adminController.getAllUsers);

module.exports = router;
