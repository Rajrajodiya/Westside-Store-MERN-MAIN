const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    imageName: { type: String, required: true },
    brand: { type: String, default: "" },
    mainImage: { type: String, required: true },
    otherImages: [{ type: String }],
    mrp: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    category: { type: String, required: true, lowercase: true },
  },
  { timestamps: true }
);

ProductSchema.index(
  { imageName: "text", brand: "text", description: "text", category: "text" },
  { weights: { imageName: 10, brand: 5, description: 3, category: 2 } }
);

module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema);
