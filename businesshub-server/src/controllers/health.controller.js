// Health controllers: API liveness and database readiness.

import config from "../config/env.js";
import { checkDatabaseConnection } from "../database/pool.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

// GET /api/health — liveness. Intentionally does not touch the database.
export function getHealth(req, res) {
  sendSuccess(res, {
    message: "Service is healthy",
    data: {
      service: "businesshub-server",
      status: "ok",
      environment: config.env,
      uptimeSeconds: Number(process.uptime().toFixed(2)),
    },
  });
}

// GET /api/health/db — database readiness. 200 when reachable, 503 otherwise.
export async function getDatabaseHealth(req, res) {
  const result = await checkDatabaseConnection();

  if (result.status === "connected") {
    return sendSuccess(res, {
      message: "Database is reachable",
      data: { database: "connected" },
    });
  }

  return sendError(res, {
    statusCode: 503,
    message: "Database is not reachable",
    details: config.isProduction ? null : { reason: result.error },
  });
}
