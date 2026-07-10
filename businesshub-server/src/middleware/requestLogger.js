// Minimal, dependency-free request logger.
//
// Logs one line per completed request: timestamp, method, URL, status code and
// duration. Kept intentionally small; can be swapped for a structured logger
// later without touching call sites. Disabled during tests to keep output clean.

import config from "../config/env.js";

export default function requestLogger(req, res, next) {
  if (config.isTest) return next();

  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ` +
        `${res.statusCode} ${durationMs.toFixed(1)}ms`
    );
  });

  next();
}
