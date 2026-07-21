const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { JWT_SECRET } = require("../middleware/auth");
const { sendPasswordResetEmail } = require("../services/email");

exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password)
      return res.status(400).json({ status: "error", message: "All fields are required" });
    if (!/\S+@\S+\.\S+/.test(email))
      return res.status(400).json({ status: "error", message: "Invalid email format" });
    if (!/^\d{10}$/.test(phone))
      return res.status(400).json({ status: "error", message: "Phone must be 10 digits" });
    if (password.length < 6)
      return res.status(400).json({ status: "error", message: "Password must be at least 6 characters" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ status: "exists", message: "User already exists. Please login." });

    const userCount = await User.countDocuments();
    const user = new User({ name, email, phone, password, isAdmin: userCount === 0 });
    await user.save();
    res.status(201).json({
      status: "success",
      message: userCount === 0 ? "Admin account created! Please login." : "Registration successful! Please login.",
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ status: "error", message: "Server error. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ status: "error", message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ status: "notfound", message: "Please signup first." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ status: "invalid", message: "Invalid email or password." });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      status: "success", token,
      user: { name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ status: "error", message: "Server error. Please try again." });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ status: "error", message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.json({ status: "success", message: "If the email exists, a reset link has been sent." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    await PasswordReset.create({ userId: user._id, email: user.email, tokenHash, expiresAt: new Date(Date.now() + 3600000) });
    await sendPasswordResetEmail(user.email, resetToken);
    res.json({ status: "success", message: "If the email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ status: "error", message: "Token and new password are required" });
    if (password.length < 6)
      return res.status(400).json({ status: "error", message: "Password must be at least 6 characters" });

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const resetEntry = await PasswordReset.findOne({ tokenHash, used: false, expiresAt: { $gt: new Date() } });
    if (!resetEntry) return res.status(400).json({ status: "error", message: "Invalid or expired reset token" });

    const user = await User.findById(resetEntry.userId);
    if (!user) return res.status(404).json({ status: "error", message: "User not found" });

    user.password = password;
    await user.save();
    resetEntry.used = true;
    await resetEntry.save();
    res.json({ status: "success", message: "Password reset successfully. Please login with your new password." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
