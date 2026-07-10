// Centralized 404 handler.
//
// Mounted after all routes: any request that reaches it matched no route, so we
// forward a structured 404 to the error handler (single formatting path).

import ApiError from "../utils/ApiError.js";

export default function notFound(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}
