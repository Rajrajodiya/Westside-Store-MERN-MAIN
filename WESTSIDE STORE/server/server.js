const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./routes/products");
const contactRoutes = require("./routes/contact");
const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");

const app = express();
app.use(cors(), express.json());

mongoose.connect("mongodb://localhost:27017/WESTSIDE-STORE", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use("/api/contact", contactRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.listen(5000, () => console.log("Server listening on port 5000"));

