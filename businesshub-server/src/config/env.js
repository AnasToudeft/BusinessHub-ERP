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

function parsePort(value, fallback, label = "PORT") {
  const port = Number(value ?? fallback);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(
      `Invalid ${label} "${value}". Expected an integer between 1 and 65535.`
    );
  }
  return port;
}

function parseBool(value, fallback) {
  if (value === undefined || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function parseInteger(value, fallback, label) {
  if (value === undefined || value === "") return fallback;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 0) {
    throw new Error(`Invalid ${label} "${value}". Expected a non-negative integer.`);
  }
  return n;
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

  // Microsoft SQL Server connection settings.
  db: Object.freeze({
    host: process.env.DB_HOST || "localhost",
    port: parsePort(process.env.DB_PORT, 1433, "DB_PORT"),
    name: process.env.DB_NAME || "businesshub",
    user: process.env.DB_USER || "sa",
    password: process.env.DB_PASSWORD || "",
    // Encrypt the connection (true for Azure SQL / production).
    encrypt: parseBool(process.env.DB_ENCRYPT, false),
    // Trust a self-signed cert (typical for a local/dev SQL Server).
    trustServerCertificate: parseBool(process.env.DB_TRUST_SERVER_CERTIFICATE, true),
    poolMax: parseInteger(process.env.DB_POOL_MAX, 10, "DB_POOL_MAX"),
    poolMin: parseInteger(process.env.DB_POOL_MIN, 0, "DB_POOL_MIN"),
    connectionTimeoutMs: parseInteger(
      process.env.DB_CONNECTION_TIMEOUT_MS,
      15000,
      "DB_CONNECTION_TIMEOUT_MS"
    ),
  }),
});

export default config;
