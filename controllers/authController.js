const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { JWT_SECRET } = require("../middleware/auth");
const { sendPasswordResetEmail } = require("../services/email");
const asyncHandler = require("../utils/asyncHandler");
const respond = require("../utils/respond");
const validate = require("../utils/validate");
const AppError = require("../utils/AppError");

// ── Helpers (normalization at boundary) ────────────────────────────

const normalizeUserInput = (body) =>
  validate.normalize(body, ["name", "emailOrPhone", "phone", "password"]);

/** Resolve a user by email OR phone */
const findByIdentifier = async (id) => {
  const EMAIL_RE = /\S+@\S+\.\S+/;
  const isEmail = EMAIL_RE.test(id);
  return isEmail
    ? User.findOne({ email: id.toLowerCase().trim() })
    : User.findOne({ phone: id.trim() });
};

// ── Exports ────────────────────────────────────────────────────────

exports.signup = asyncHandler(async (req, res) => {
  const { name, emailOrPhone, phone, password } = normalizeUserInput(req.body);
  validate.required({ name, emailOrPhone, phone, password }, ["name", "emailOrPhone", "phone", "password"]);

  // emailOrPhone can be an email address or a phone number
  const EMAIL_RE = /\S+@\S+\.\S+/;
  const isEmail = EMAIL_RE.test(emailOrPhone);
  const email = isEmail ? emailOrPhone.toLowerCase().trim() : undefined;
  const phoneForCheck = isEmail ? phone.trim() : emailOrPhone.trim();

  if (isEmail) {
    validate.email(email);
    validate.phone(phone);
  } else {
    validate.phone(emailOrPhone);
  }
  validate.password(password);

  // Check by email OR phone
  const exists = isEmail
    ? await User.findOne({ email })
    : await User.findOne({ phone: emailOrPhone.trim() });
  if (exists) {
    return res.json({ status: "exists", message: "User already exists. Please login." });
  }

  const userCount = await User.countDocuments();
  await User.create({
    name,
    email: email || `${phoneForCheck}@phone.user`,
    phone: phoneForCheck,
    password,
    isAdmin: userCount === 0,
  });

  respond.created(res, {
    message: userCount === 0
      ? "Admin account created! Please login."
      : "Registration successful! Please login.",
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { emailOrPhone, password } = normalizeUserInput(req.body);
  validate.required({ emailOrPhone, password }, ["emailOrPhone", "password"]);

  const user = await findByIdentifier(emailOrPhone);
  if (!user) {
    return res.json({ status: "notfound", message: "User not found. Please signup first." });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.json({ status: "fail", message: "Invalid email or password." });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  respond.success(res, {
    token,
    user: { name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin },
  });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = validate.normalize(req.body, ["email"]);
  validate.required({ email }, ["email"]);
  validate.email(email);

  // Always return the same message (don't reveal if email exists)
  const user = await User.findOne({ email });
  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");
    await PasswordReset.create({
      userId: user._id, email: user.email, tokenHash,
      expiresAt: new Date(Date.now() + 3600000),
    });
    sendPasswordResetEmail(user.email, resetToken).catch(() => {});
  }

  respond.success(res, { message: "If the email exists, a reset link has been sent." });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password: rawPw } = validate.normalize(req.body, ["password"]);
  const { token: t } = req.body;
  validate.required({ token: t, password: rawPw }, ["token", "password"]);
  validate.password(rawPw);

  const tokenHash = crypto.createHash("sha256").update(t).digest("hex");
  const resetEntry = await PasswordReset.findOne({
    tokenHash, used: false, expiresAt: { $gt: new Date() },
  });
  if (!resetEntry) throw AppError.badRequest("Invalid or expired reset token");

  const user = await User.findById(resetEntry.userId);
  if (!user) throw AppError.notFound("User not found");

  user.password = rawPw;
  resetEntry.used = true;
  await Promise.all([user.save(), resetEntry.save()]);

  respond.success(res, { message: "Password reset successfully. Please login with your new password." });
});
