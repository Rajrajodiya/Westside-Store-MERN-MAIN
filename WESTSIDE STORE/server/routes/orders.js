const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Order Schema
const orderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  orderNumber: { type: String, required: true, unique: true },
  items: [{
    _id: String,
    imageName: String,
    mainImage: String,
    price: Number,
    quantity: Number,
    category: String
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  receiverName: { type: String, required: true },
  status: { type: String, default: "Processing" },
  orderDate: { type: Date, default: Date.now },
  deliveryDate: { type: Date }
});

const Order = mongoose.model("Order", orderSchema);

// Place Order
router.post("/place", async (req, res) => {
  try {
    const { userEmail, items, totalAmount, paymentMethod, receiverName } = req.body;
    
    if (!userEmail || !items || !totalAmount || !paymentMethod || !receiverName) {
      return res.json({ status: "error", message: "All fields required" });
    }

    // Generate unique order number
    const orderNumber = "WS" + Date.now() + Math.floor(Math.random() * 1000);
    
    // Set delivery date (5-7 days from now)
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 5);

    const order = new Order({
      userEmail,
      orderNumber,
      items,
      totalAmount,
      paymentMethod,
      receiverName,
      deliveryDate,
      status: "Processing"
    });

    await order.save();
    res.json({ status: "success", orderNumber });
  } catch (error) {
    console.error("Order placement error:", error);
    res.json({ status: "error", message: "Failed to place order" });
  }
});

// Get Orders for User
router.get("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await Order.find({ userEmail: email }).sort({ orderDate: -1 });
    res.json({ status: "success", orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.json({ status: "error", message: "Failed to fetch orders" });
  }
});

// Update Order Status (for admin use)
router.put("/status/:orderNumber", async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;
    
    const order = await Order.findOneAndUpdate(
      { orderNumber },
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.json({ status: "error", message: "Order not found" });
    }
    
    res.json({ status: "success", order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.json({ status: "error", message: "Failed to update order status" });
  }
});

module.exports = router; 