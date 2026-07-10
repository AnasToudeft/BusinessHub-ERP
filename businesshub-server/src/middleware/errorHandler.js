// Centralized error handler (must be the last middleware registered).
//
// Turns any thrown/forwarded error into the consistent error envelope:
//   - ApiError      -> its own statusCode/message/details
//   - anything else -> 500 "Internal Server Error" (message hidden from client)
// Server-side (5xx) errors are logged with their stack. In development the
// stack is also returned to the client to speed up debugging.

import config from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import { sendError } from "../utils/apiResponse.js";

// Express identifies error handlers by their 4-argument signature, so `next`
// must be present even though it is unused.
export default function errorHandler(err, req, res, next) {
  void next;
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;
  const message = isApiError ? err.message : "Internal Server Error";
  let details = isApiError ? err.details : null;

  if (statusCode >= 500) {
    console.error(
      `[${new Date().toISOString()}] Unhandled error on ${req.method} ${req.originalUrl}:`,
      err.stack || err
    );
    if (config.isDevelopment) {
      details = { stack: err.stack };
    }
  }

  sendError(res, { statusCode, message, details });
}
