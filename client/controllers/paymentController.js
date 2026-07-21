const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");
const asyncHandler = require("../utils/asyncHandler");
const respond = require("../utils/respond");
const AppError = require("../utils/AppError");

const isStripeConfigured = () =>
  process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== "sk_test_placeholder";

exports.createPaymentIntent = asyncHandler(async (req, res) => {
  const { amount, currency } = req.body;
  if (!amount || amount <= 0) throw AppError.badRequest("Invalid amount");

  // Mock mode — tell, don't ask (the env var answers the question)
  if (!isStripeConfigured()) {
    return respond.success(res, {
      mock: true,
      clientSecret: `pi_mock_${Date.now()}_secret_mock`,
      message: "Mock payment (no real Stripe key)",
    });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency || "inr",
    metadata: { userId: req.user.id, email: req.user.email },
  });

  respond.success(res, { clientSecret: paymentIntent.client_secret });
});

exports.handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    if (isStripeConfigured() && process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(req.body);
    }
  } catch (err) {
    return respond.error(res, 400, `Webhook Error: ${err.message}`);
  }

  // Declarative event routing
  const eventHandlers = {
    "payment_intent.succeeded": () => console.log("✅ Payment succeeded:", event.data.object.id),
    "payment_intent.payment_failed": () => console.error("❌ Payment failed:", event.data.object.id),
  };

  (eventHandlers[event.type] || (() => {}))();
  respond.success(res, { received: true });
});
