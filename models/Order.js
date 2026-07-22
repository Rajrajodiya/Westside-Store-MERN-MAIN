const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    imageName: { type: String, default: "" },
    mainImage: { type: String, default: "" },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    category: { type: String, default: "" },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, index: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    receiverName: { type: String, required: true },
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    deliveryDate: { type: Date },
  },
  { timestamps: true }
);

OrderSchema.pre("save", function (next) {
  if (!this.deliveryDate) {
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 3) + 5);
    this.deliveryDate = date;
  }
  next();
});

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);
