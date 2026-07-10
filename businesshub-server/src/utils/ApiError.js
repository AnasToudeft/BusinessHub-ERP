// Operational error type carrying an HTTP status code and optional details.
//
// Throw these from controllers/services to signal an expected failure (bad
// input, not found, unauthorized, ...). The centralized error handler turns
// them into a consistent JSON response. Anything that is NOT an ApiError is
// treated as an unexpected 500.

export default class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = "Bad Request", details = null) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = "Unauthorized") {
    return new ApiError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new ApiError(403, message);
  }

  static notFound(message = "Not Found") {
    return new ApiError(404, message);
  }

  static conflict(message = "Conflict", details = null) {
    return new ApiError(409, message, details);
  }

  static internal(message = "Internal Server Error") {
    return new ApiError(500, message);
  }
}
