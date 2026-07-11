// Health routes. Mounted at /api/health by the router aggregator.

import { Router } from "express";

import { getHealth, getDatabaseHealth } from "../controllers/health.controller.js";

const router = Router();

// GET /api/health      -> liveness
router.get("/", getHealth);
// GET /api/health/db   -> database readiness
router.get("/db", getDatabaseHealth);

export default router;
