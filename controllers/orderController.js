const Order = require("../models/Order");
const PDFDocument = require("pdfkit");
const { sendOrderConfirmation } = require("../services/email");
const asyncHandler = require("../utils/asyncHandler");
const respond = require("../utils/respond");
const validate = require("../utils/validate");
const AppError = require("../utils/AppError");

const VALID_STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"];

// ── Exports ────────────────────────────────────────────────────────

exports.placeOrder = asyncHandler(async (req, res) => {
  const { userEmail, items, totalAmount, paymentMethod, receiverName } =
    validate.normalize(req.body, ["userEmail", "receiverName"]);

  validate.required(
    { userEmail, items, totalAmount, paymentMethod, receiverName },
    ["userEmail", "items", "totalAmount", "paymentMethod", "receiverName"]
  );

  if (!Array.isArray(items) || items.length === 0)
    throw AppError.badRequest("At least one item is required");
  if (req.user.email !== userEmail)
    throw AppError.forbidden("You can only place orders for your own account.");

  const orderNumber = "WS" + Date.now() + Math.floor(Math.random() * 1000);
  const order = await Order.create({
    userEmail, orderNumber, items, totalAmount, paymentMethod, receiverName,
    status: "Processing",
  });

  sendOrderConfirmation(order).catch(() => {});

  respond.created(res, { orderNumber, message: "Order placed successfully" });
});

exports.getUserOrders = asyncHandler(async (req, res) => {
  if (req.user.email !== req.params.email)
    throw AppError.forbidden("You can only view your own orders.");

  const orders = await Order.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
  respond.list(res, orders, { count: orders.length });
});

exports.generateInvoice = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });
  if (!order) throw AppError.notFound("Order not found");
  if (req.user.email !== order.userEmail)
    throw AppError.forbidden("Unauthorized");

  const doc = new PDFDocument({ margin: 50, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=invoice-${order.orderNumber}.pdf`);
  doc.pipe(res);

  doc.fontSize(24).font("Helvetica-Bold").text("WESTSIDE STORE", { align: "center" });
  doc.fontSize(10).font("Helvetica").text("Tax Invoice", { align: "center" }).moveDown();
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#cccccc").moveDown();
  doc.fontSize(12).font("Helvetica-Bold").text(`Invoice #${order.orderNumber}`);
  doc.fontSize(10).font("Helvetica");
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`);
  doc.text(`Customer: ${order.receiverName}`);
  doc.text(`Email: ${order.userEmail}`);
  doc.text(`Payment: ${order.paymentMethod}`).moveDown();
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#cccccc").moveDown();
  doc.fontSize(10).font("Helvetica-Bold");
  doc.text("Item", 50, doc.y, { width: 250 });
  doc.text("Qty", 300, doc.y, { width: 50, align: "center" });
  doc.text("Price", 350, doc.y, { width: 80, align: "right" });
  doc.text("Total", 450, doc.y, { width: 80, align: "right" });
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#cccccc").moveDown();
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
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke("#cccccc").moveDown();
  doc.font("Helvetica-Bold").fontSize(14);
  doc.text(`Grand Total: ₹${order.totalAmount}`, { align: "right" }).moveDown();
  doc.font("Helvetica").fontSize(10);
  doc.text(`Status: ${order.status}`);
  doc.text(`Expected Delivery: ${new Date(order.deliveryDate).toLocaleDateString("en-IN")}`);
  doc.moveDown(2);
  doc.fontSize(8).fillColor("#888888");
  doc.text("Thank you for shopping at WestSide Store!", { align: "center" });
  doc.text("This is a computer-generated invoice.", { align: "center" });
  doc.end();
});

exports.updateStatus = asyncHandler(async (req, res) => {
  if (!VALID_STATUSES.includes(req.body.status))
    throw AppError.badRequest(`Invalid status. Use: ${VALID_STATUSES.join(", ")}`);

  const order = await Order.findOneAndUpdate(
    { orderNumber: req.params.orderNumber },
    { status: req.body.status },
    { new: true }
  );
  if (!order) throw AppError.notFound("Order not found");

  respond.success(res, { order });
});
