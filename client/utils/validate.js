/**
 * validate — Input validation & normalization at boundaries.
 *
 * Principles:
 * - Fail Fast:  Validate inputs immediately at the API boundary before any business logic.
 * - Normalization at Boundaries:  Normalize (trim, lowercase, etc.) as data enters the system.
 * - DRY:  One place for email/phone/password validation instead of inline regexes.
 * - Brevity vs Readability:  Short fluent checks over verbose if-blocks.
 */

const AppError = require("./AppError");

const EMAIL_RE    = /\S+@\S+\.\S+/;
const PHONE_RE    = /^\d{10}$/;
const PASSWORD_MIN = 6;

const validate = {
  normalize(obj = {}, keys = []) {
    const out = {};
    for (const k of keys) {
      let val = obj[k];
      if (typeof val === "string") {
        val = val.trim();
        if (k === "email") val = val.toLowerCase();
      }
      out[k] = val;
    }
    return out;
  },

  required(obj = {}, keys = []) {
    for (const k of keys) {
      const val = obj[k];
      if (val === undefined || val === null || (typeof val === "string" && val === "")) {
        throw AppError.badRequest(`${k} is required`);
      }
    }
    return obj;
  },

  email(val) {
    if (!EMAIL_RE.test(val)) throw AppError.badRequest("Invalid email format");
    return val;
  },

  phone(val) {
    if (!PHONE_RE.test(val)) throw AppError.badRequest("Phone must be 10 digits");
    return val;
  },

  password(val) {
    if (!val || val.length < PASSWORD_MIN) {
      throw AppError.badRequest(`Password must be at least ${PASSWORD_MIN} characters`);
    }
    return val;
  },
};

module.exports = validate;
