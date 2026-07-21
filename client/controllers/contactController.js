const Contact = require("../models/Contact");

exports.submit = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ status: "error", message: "All fields are required" });
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ status: "success" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ status: "error", message: "Failed to submit contact form" });
  }
};
