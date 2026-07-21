const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/auth");

router.post("/place", authMiddleware, orderController.placeOrder);
router.get("/user/:email", authMiddleware, orderController.getUserOrders);
router.get("/:orderNumber/invoice", authMiddleware, orderController.generateInvoice);
router.put("/status/:orderNumber", authMiddleware, orderController.updateStatus);

module.exports = router;
