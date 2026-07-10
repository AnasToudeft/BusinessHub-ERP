// Application entry point: loads env, starts the HTTP server, handles shutdown.

// Load environment variables from .env before anything else is imported.
import "dotenv/config";

import config from "./config/env.js";
import app from "./app.js";

const server = app.listen(config.port, () => {
  console.log(
    `BusinessHub ERP API running in ${config.env} mode on http://localhost:${config.port}`
  );
  console.log(`Health check: http://localhost:${config.port}/api/health`);
});

// Graceful shutdown on termination signals.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => process.exit(0));
  });
}

export default server;
