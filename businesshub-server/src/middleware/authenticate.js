// Authentication middleware: validates the Bearer JWT and attaches the caller
// to req.user ({ id, email, roles, permissions }) for downstream handlers.

import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return next(ApiError.unauthorized("Missing or malformed Authorization header."));
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
      permissions: payload.permissions || [],
    };
    return next();
  } catch {
    return next(ApiError.unauthorized("Invalid or expired token."));
  }
}
