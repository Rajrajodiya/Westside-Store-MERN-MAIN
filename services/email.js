const nodemailer = require("nodemailer");

const createTransporter = () => nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.resend.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: { user: process.env.SMTP_USER || "resend", pass: process.env.SMTP_PASSWORD || "" },
});

const orderConfirmationHTML = (order) => `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
<div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;border-radius:10px 10px 0 0;text-align:center;">
<h1 style="color:white;margin:0;">WestSide Store</h1></div>
<div style="background:#f9f9f9;padding:20px;border-radius:0 0 10px 10px;border:1px solid #e0e0e0;">
<h2>Order Confirmed! 🎉</h2><p>Thank you for your order, <strong>${order.receiverName}</strong>!</p>
<div style="background:white;padding:15px;border-radius:8px;margin:15px 0;border:1px solid #e0e0e0;">
<p><strong>Order Number:</strong> ${order.orderNumber}</p>
<p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
<p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
<p><strong>Expected Delivery:</strong> ${new Date(order.deliveryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div>
<h3>Items Ordered:</h3><ul>${order.items.map(item => `<li>${item.imageName} — ₹${item.price} x ${item.quantity}</li>`).join("")}</ul>
<p style="margin-top:20px;">Track your order: <a href="${process.env.CLIENT_URL || "http://localhost:3000"}/myaccount" style="color:#667eea;">My Account</a></p>
<hr><p style="color:#888;font-size:12px;">This is an automated email from WestSide Store.</p></div></body></html>`;

const passwordResetHTML = (resetLink) => `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
<div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:20px;border-radius:10px 10px 0 0;text-align:center;">
<h1 style="color:white;margin:0;">WestSide Store</h1></div>
<div style="background:#f9f9f9;padding:20px;border-radius:0 0 10px 10px;border:1px solid #e0e0e0;">
<h2>Password Reset</h2><p>You requested a password reset. This link expires in 1 hour.</p>
<div style="text-align:center;margin:25px 0;">
<a href="${resetLink}" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:14px 30px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block;">Reset Password</a></div>
<p>If you didn't request this, please ignore this email.</p>
<hr><p style="color:#888;font-size:12px;">This is an automated email from WestSide Store.</p></div></body></html>`;

async function sendOrderConfirmation(order) {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"WestSide Store" <${process.env.SMTP_FROM || "orders@westside-store.com"}>`,
      to: order.userEmail, subject: `Order Confirmed! #${order.orderNumber}`,
      html: orderConfirmationHTML(order),
    });
    console.log(`📧 Order confirmation sent to ${order.userEmail}`);
  } catch (error) { console.error("Email send error (order confirmation):", error.message); }
}

async function sendPasswordResetEmail(email, resetToken) {
  const resetLink = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"WestSide Store" <${process.env.SMTP_FROM || "noreply@westside-store.com"}>`,
      to: email, subject: "Reset Your WestSide Store Password", html: passwordResetHTML(resetLink),
    });
    console.log(`📧 Password reset email sent to ${email}`);
    return true;
  } catch (error) { console.error("Email send error (password reset):", error.message); return false; }
}

module.exports = { sendOrderConfirmation, sendPasswordResetEmail };
