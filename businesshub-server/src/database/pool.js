// SQL Server connection pool.
//
// Exposes a lazily-created, shared mssql ConnectionPool plus small helpers.
// Connecting is intentionally decoupled from server startup: the API can run
// (and report DB status via /api/health/db) even when SQL Server is
// unavailable, which keeps local development friction low.

import sql from "mssql";

import config from "../config/env.js";

let pool = null;

function buildPoolConfig() {
  return {
    server: config.db.host,
    port: config.db.port,
    database: config.db.name,
    user: config.db.user,
    password: config.db.password,
    pool: {
      max: config.db.poolMax,
      min: config.db.poolMin,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: config.db.encrypt,
      trustServerCertificate: config.db.trustServerCertificate,
    },
    connectionTimeout: config.db.connectionTimeoutMs,
  };
}

// Connect (or reuse an existing connection). Rejects if the server is
// unreachable — callers that must tolerate an absent DB should catch.
export async function connectDatabase() {
  if (pool && pool.connected) return pool;

  const connected = await new sql.ConnectionPool(buildPoolConfig()).connect();
  connected.on("error", (err) => {
    console.error("[db] pool error:", err.message);
  });
  pool = connected;
  return pool;
}

// Returns the active pool or throws if not connected. Use inside request
// handlers/repositories that already assume a live connection.
export function getPool() {
  if (!pool || !pool.connected) {
    throw new Error("Database not connected. Call connectDatabase() first.");
  }
  return pool;
}

// Safe reachability probe for health checks — never throws.
export async function checkDatabaseConnection() {
  try {
    const p = await connectDatabase();
    await p.request().query("SELECT 1 AS ok");
    return { status: "connected" };
  } catch (err) {
    return { status: "disconnected", error: err.message };
  }
}

export async function closeDatabase() {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

// Re-export the driver so migrations/repositories can use sql types & helpers.
export { sql };
