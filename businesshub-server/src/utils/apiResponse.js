// Helpers that enforce a single, consistent JSON envelope for every response.
//
// Success: { success: true,  message, data, timestamp }
// Error:   { success: false, message, error: { statusCode, details }, timestamp }
//
// Controllers should return sendSuccess(...); the centralized error handler is
// the only place that calls sendError(...).

export function sendSuccess(
  res,
  { data = null, message = "OK", statusCode = 200 } = {}
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

export function sendError(
  res,
  { message = "Internal Server Error", statusCode = 500, details = null } = {}
) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: { statusCode, details },
    timestamp: new Date().toISOString(),
  });
}
