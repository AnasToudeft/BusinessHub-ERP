// JSON Web Token helpers wrapping the configured secret and expiry.

import jwt from "jsonwebtoken";

import config from "../config/env.js";

export function signToken(payload) {
  return jwt.sign(payload, config.auth.jwtSecret, {
    expiresIn: config.auth.jwtExpiresIn,
  });
}

// Throws (jwt.JsonWebTokenError / TokenExpiredError) on invalid/expired tokens.
export function verifyToken(token) {
  return jwt.verify(token, config.auth.jwtSecret);
}
