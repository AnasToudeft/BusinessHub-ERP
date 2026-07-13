// Centralized error handler (must be the last middleware registered).
//
// Maps errors to the consistent error envelope:
//   - ApiError                    -> its own statusCode/message/details
//   - malformed JSON body         -> 400 (from express.json / body-parser)
//   - other errors with a 4xx     -> that status (client error)
//   - anything else               -> 500 "Internal Server Error"
// Unexpected server errors are logged with their stack (and the stack is
// returned in development); expected operational failures are logged concisely.

import config from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import { sendError } from "../utils/apiResponse.js";

// Express identifies error handlers by their 4-argument signature, so `next`
// must be present even though it is unused.
export default function errorHandler(err, req, res, next) {
  void next;

  const isApiError = err instanceof ApiError;
  let statusCode;
  let message;
  let details = null;

  if (isApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err.type === "entity.parse.failed") {
    // Thrown by express.json() when the request body is not valid JSON.
    statusCode = 400;
    message = "Malformed JSON in request body.";
  } else if (Number.isInteger(err.status) && err.status >= 400 && err.status < 500) {
    statusCode = err.status;
    message = err.message || "Bad Request.";
  } else {
    statusCode = 500;
    message = "Internal Server Error";
  }

  if (statusCode >= 500) {
    if (isApiError) {
      // Expected operational failure (e.g. DB unavailable) — log concisely.
      console.error(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} -> ${statusCode}: ${err.message}`
      );
    } else {
      // Genuinely unexpected — log the stack, and expose it in development.
      console.error(
        `[${new Date().toISOString()}] Unhandled error on ${req.method} ${req.originalUrl}:`,
        err.stack || err
      );
      if (config.isDevelopment) {
        details = { stack: err.stack };
      }
    }
  }

  sendError(res, { statusCode, message, details });
}
