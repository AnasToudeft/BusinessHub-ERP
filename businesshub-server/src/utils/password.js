// Password hashing helpers.
//
// Uses bcryptjs (pure-JS bcrypt) to avoid native compilation on Windows/newer
// Node versions. API-compatible with the native `bcrypt` package, so swapping
// is trivial if a native build is preferred later.

import bcrypt from "bcryptjs";

import config from "../config/env.js";

export function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, config.auth.bcryptSaltRounds);
}

export function comparePassword(plainPassword, passwordHash) {
  return bcrypt.compare(plainPassword, passwordHash);
}
