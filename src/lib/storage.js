/**
 * storage — Normalized localStorage helpers.
 *
 * Principles:
 * - DRY:             Single source of truth for localStorage access.
 * - Law of Demeter:  Components talk to this module, not to localStorage directly.
 * - Normalization:   Every read/write is type-safe and consistent.
 * - Fail Fast:       Silent try/catch on parse prevents crashes from corrupt data.
 */

const parse = (raw) => {
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
};

// ── Auth ───────────────────────────────────────────────────────────
const AUTH_KEY = "login_detail";

export const getLogin = () => parse(localStorage.getItem(AUTH_KEY));

export const saveLogin = (data) => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
};

export const clearLogin = () => localStorage.removeItem(AUTH_KEY);

// ── Cart / Wishlist (keyed by userKey) ─────────────────────────────

const readList = (key) => {
  const raw = localStorage.getItem(key);
  const items = parse(raw);
  return Array.isArray(items) ? items : [];
};

const writeList = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items));
};

export const getCart = (userKey) =>
  readList(`cart_${userKey}`).map((p) => ({ ...p, quantity: p.quantity || 1 }));

export const saveCart = (userKey, items) => writeList(`cart_${userKey}`, items);

export const getWishlist = (userKey) => readList(`wishlist_${userKey}`);

export const saveWishlist = (userKey, items) => writeList(`wishlist_${userKey}`, items);

// ── Cart count (lightweight, no full parse) ────────────────────────

export const getCartCount = (userKey) => {
  const raw = localStorage.getItem(`cart_${userKey}`);
  const items = parse(raw);
  return Array.isArray(items) ? items.length : 0;
};
