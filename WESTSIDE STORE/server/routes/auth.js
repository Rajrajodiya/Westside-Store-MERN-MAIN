const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);
// Register
router.post("/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.json({ status: "error", message: "All fields required" });
  }
  const exists = await User.findOne({ email });
  if (exists) {
    return res.json({ status: "exists" });
  }
  const user = new User({ name, email, phone, password });
  await user.save();
  res.json({ status: "success" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ status: "notfound" });
  }
  if (user.password === password) {
    return res.json({ status: "success", user: { name: user.name, email: user.email } });
  }
  res.json({ status: "invalid" });
});

module.exports = router;