const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model("Contact", contactSchema);

router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const contact = new Contact({ name, email, message });
        await contact.save();
        res.json({ status: "success" });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

module.exports = router;