// Rate limiters. `authLimiter` throttles auth endpoints to slow brute-force
// attempts. Responses reuse the standard API error envelope.

import rateLimit from "express-rate-limit";

import { sendError } from "../utils/apiResponse.js";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // per IP, per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    sendError(res, {
      statusCode: 429,
      message: "Too many requests. Please try again later.",
    }),
});
