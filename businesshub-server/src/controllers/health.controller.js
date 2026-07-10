// Health controller: reports basic liveness information about the API.

import config from "../config/env.js";
import { sendSuccess } from "../utils/apiResponse.js";

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
