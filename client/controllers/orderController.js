const Order = require("../models/Order");
const PDFDocument = require("pdfkit");
const { sendOrderConfirmation } = require("../services/email");

exports.placeOrder = async (req, res) => {
  try {
    const { userEmail, items, totalAmount, paymentMethod, receiverName } = req.body;
    if (!userEmail || !items || !totalAmount || !paymentMethod || !receiverName)
      return res.status(400).json({ status: "error", message: "All fields required" });
    if (!Array.isArray(items) || items.length === 0)
      return res.status(400).json({ status: "error", message: "At least one item is required" });
    if (req.user.email !== userEmail)
      return res.status(403).json({ status: "error", message: "You can only place orders for your own account." });

    const orderNumber = "WS" + Date.now() + Math.floor(Math.random() * 1000);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 5);

    const order = new Order({ userEmail, orderNumber, items, totalAmount, paymentMethod, receiverName, status: "Processing", deliveryDate });
    await order.save();
    sendOrderConfirmation(order);
    res.status(201).json({ status: "success", orderNumber, message: "Order placed successfully" });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ status: "error", message: "Failed to place order" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    if (req.user.email !== req.params.email)
      return res.status(403).json({ status: "error", message: "You can only view your own orders." });
    const orders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json({ status: "success", orders });
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ status: "error", message: "Failed to fetch orders" });
  }
};

exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ status: "error", message: "Order not found" });
    if (req.user.email !== order.userEmail) return res.status(403).json({ status: "error", message: "Unauthorized" });

    const doc = new PDFDocument({ margin: 50, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.orderNumber}.pdf`);
    doc.pipe(res);

    doc.fontSize(24).font("Helvetica-Bold").text("WESTSIDE STORE", { align: "center" });
    doc.fontSize(10).font("Helvetica").text("Tax Invoice", { align: "center" });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#cccccc");
    doc.moveDown();
    doc.fontSize(12).font("Helvetica-Bold").text(`Invoice #${order.orderNumber}`);
    doc.fontSize(10).font("Helvetica");
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`);
    doc.text(`Customer: ${order.receiverName}`);
    doc.text(`Email: ${order.userEmail}`);
    doc.text(`Payment: ${order.paymentMethod}`);
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#cccccc");
    doc.moveDown();
    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Item", 50, doc.y, { width: 250 });
    doc.text("Qty", 300, doc.y, { width: 50, align: "center" });
    doc.text("Price", 350, doc.y, { width: 80, align: "right" });
    doc.text("Total", 450, doc.y, { width: 80, align: "right" });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#cccccc");
    doc.moveDown();
    doc.font("Helvetica");
    order.items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      doc.text(item.imageName || "Product", 50, doc.y, { width: 240 });
      doc.text(String(item.quantity), 300, doc.y, { width: 50, align: "center" });
      doc.text(`₹${item.price}`, 350, doc.y, { width: 80, align: "right" });
      doc.text(`₹${itemTotal}`, 450, doc.y, { width: 80, align: "right" });
      doc.moveDown(0.8);
    });
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#cccccc");
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(14);
    doc.text(`Grand Total: ₹${order.totalAmount}`, { align: "right" });
    doc.moveDown();
    doc.font("Helvetica").fontSize(10);
    doc.text(`Status: ${order.status}`);
    doc.text(`Expected Delivery: ${new Date(order.deliveryDate).toLocaleDateString("en-IN")}`);
    doc.moveDown(2);
    doc.fontSize(8).fillColor("#888888");
    doc.text("Thank you for shopping at WestSide Store!", { align: "center" });
    doc.text("This is a computer-generated invoice.", { align: "center" });
    doc.end();
  } catch (error) {
    console.error("Invoice generation error:", error);
    res.status(500).json({ status: "error", message: "Failed to generate invoice" });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(req.body.status))
      return res.status(400).json({ status: "error", message: `Invalid status. Use: ${validStatuses.join(", ")}` });
    const order = await Order.findOneAndUpdate({ orderNumber: req.params.orderNumber }, { status: req.body.status }, { new: true });
    if (!order) return res.status(404).json({ status: "error", message: "Order not found" });
    res.json({ status: "success", order });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ status: "error", message: "Failed to update order status" });
  }
};
