/**
 * AppError — Custom operational error for fail-fast, CQS-compliant error handling.
 *
 * Throw this in business logic to immediately bail with a known status code.
 * The asyncHandler wrapper catches it and sends the response — SRP preserved.
 *
 * Usage:
 *   throw new AppError(400, "Email is required");
 *   throw new AppError(404, "User not found");
 *   throw new AppError(403, "Access denied");
 */

class AppError extends Error {
  /**
   * @param {number} statusCode - HTTP status code
   * @param {string} message    - Human-readable error message
   * @param {object} [meta]     - Optional metadata (for logging / debugging)
   */
  constructor(statusCode, message, meta) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.meta = meta;
    // Operational = known, expected failures (vs programming bugs)
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  /** Convenience factories for common statuses — tell, don't ask */
  static badRequest(msg, meta)        { return new AppError(400, msg, meta); }
  static notFound(msg, meta)          { return new AppError(404, msg || "Resource not found", meta); }
  static unauthorized(msg)            { return new AppError(401, msg || "Unauthorized"); }
  static forbidden(msg)               { return new AppError(403, msg || "Forbidden"); }
  static conflict(msg, meta)          { return new AppError(409, msg, meta); }
  static internal(msg)                { return new AppError(500, msg || "Internal server error"); }
}

module.exports = AppError;
