/**
 * asyncHandler — Eliminates try-catch boilerplate from every controller.
 *
 * Wraps an async Express handler so that any thrown/rejected error
 * is forwarded to the global error handler via next().
 *
 * Principle: DRY (one try-catch instead of N), SRP (controller focuses on logic).
 *
 * Usage:
 *   router.get("/foo", asyncHandler(async (req, res) => { ... }));
 *   // or in controller files:
 *   exports.search = asyncHandler(async (req, res) => { ... });
 */

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
