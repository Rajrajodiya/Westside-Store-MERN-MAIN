/**
 * respond — CQS-compliant response helpers.
 *
 * By extracting every res.json/res.status call into named helpers we:
 * - CQS:  Each controller becomes a pure command that doesn't mix response formatting.
 * - Tell, Don't Ask:  Controller says "respond.success(data)" instead of asking res for json().
 * - Law of Demeter:  Controllers talk only to their immediate dependency (the respond object).
 * - DRY:  Response shape is defined in one place.
 *
 * Usage:
 *   respond.success(res, { user });
 *   respond.created(res, product);
 *   respond.error(res, 400, "Bad input");
 */

const respond = {
  /** 200 — Generic success */
  success(res, data = {}, statusCode = 200) {
    const body = { ...data, status: "success" };
    return res.status(statusCode).json(body);
  },

  /** 201 — Resource created */
  created(res, data = {}) {
    return respond.success(res, data, 201);
  },

  /** 200 — Data list (normalized shape) */
  list(res, items, { count, total, page, pages } = {}) {
    const body = { status: "success", count: count ?? items.length, [Array.isArray(items) ? "results" : "items"]: items };
    if (total !== undefined) body.total = total;
    if (page !== undefined)  body.page = page;
    if (pages !== undefined) body.pages = pages;
    return res.json(body);
  },

  /** 4xx / 5xx — Error */
  error(res, statusCode, message, meta) {
    return res.status(statusCode).json({ status: "error", message, ...(meta ? { meta } : {}) });
  },
};

module.exports = respond;
