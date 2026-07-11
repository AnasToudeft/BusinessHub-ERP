// Application entry point: loads env, starts the HTTP server, handles shutdown.

// Load environment variables from .env before anything else is imported.
import "dotenv/config";

import config from "./config/env.js";
import app from "./app.js";
import { connectDatabase, closeDatabase } from "./database/pool.js";

const server = app.listen(config.port, () => {
  console.log(
    `BusinessHub ERP API running in ${config.env} mode on http://localhost:${config.port}`
  );
  console.log(`Health check: http://localhost:${config.port}/api/health`);
});

// Attempt an initial database connection, but do NOT crash the API if it fails:
// SQL Server may not be running yet during local development. Readiness is
// reported by GET /api/health/db.
connectDatabase()
  .then(() =>
    console.log(`[db] connected to SQL Server at ${config.db.host}:${config.db.port}`)
  )
  .catch((err) =>
    console.warn(
      `[db] not connected: ${err.message} — API continues; ` +
        `configure .env and start SQL Server, then check /api/health/db`
    )
  );

// Graceful shutdown on termination signals.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    closeDatabase()
      .catch(() => {})
      .finally(() => server.close(() => process.exit(0)));
  });
}

export default server;
