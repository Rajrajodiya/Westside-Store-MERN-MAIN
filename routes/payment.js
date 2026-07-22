const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authMiddleware } = require("../middleware/auth");

router.post("/create-payment-intent", authMiddleware, paymentController.createPaymentIntent);
router.post("/webhook", express.raw({ type: "application/json" }), paymentController.handleWebhook);

module.exports = router;
