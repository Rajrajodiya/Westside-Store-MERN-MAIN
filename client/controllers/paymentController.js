const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ status: "error", message: "Invalid amount" });

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_placeholder") {
      return res.json({ status: "success", mock: true, clientSecret: `pi_mock_${Date.now()}_secret_mock`, message: "Mock payment (no real Stripe key)" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), currency: currency || "inr",
      metadata: { userId: req.user.id, email: req.user.email },
    });
    res.json({ status: "success", clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe payment intent error:", error);
    res.status(500).json({ status: "error", message: "Failed to create payment intent" });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    if (process.env.STRIPE_WEBHOOK_SECRET && stripe) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(req.body);
    }
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  switch (event.type) {
    case "payment_intent.succeeded": console.log("✅ Payment succeeded:", event.data.object.id); break;
    case "payment_intent.payment_failed": console.error("❌ Payment failed:", event.data.object.id); break;
  }
  res.json({ received: true });
};
