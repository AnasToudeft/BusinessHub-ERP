// Centralized, validated environment configuration.
//
// This module reads process.env once, validates and coerces the values the
// application depends on, and exposes a single frozen `config` object.
// Importing modules should never read process.env directly — they use this.
//
// Validation runs at import time and throws a clear error on invalid input so
// the process fails fast during startup rather than misbehaving later.

const VALID_ENVS = ["development", "production", "test"];

function parseNodeEnv(value) {
  const env = value || "development";
  if (!VALID_ENVS.includes(env)) {
    throw new Error(
      `Invalid NODE_ENV "${env}". Expected one of: ${VALID_ENVS.join(", ")}.`
    );
  }
  return env;
}

function parsePort(value, fallback) {
  const port = Number(value ?? fallback);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(
      `Invalid PORT "${value}". Expected an integer between 1 and 65535.`
    );
  }
  return port;
}

const nodeEnv = parseNodeEnv(process.env.NODE_ENV);

const config = Object.freeze({
  env: nodeEnv,
  isProduction: nodeEnv === "production",
  isDevelopment: nodeEnv === "development",
  isTest: nodeEnv === "test",
  port: parsePort(process.env.PORT, 5000),
  // CORS origin(s). Use "*" for any origin, or a comma-free single origin.
  corsOrigin: process.env.CORS_ORIGIN || "*",
});

export default config;
