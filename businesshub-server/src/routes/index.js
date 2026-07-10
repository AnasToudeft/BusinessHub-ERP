// API router aggregator.
//
// Single place where feature routers are mounted under the `/api` prefix.
// New modules (auth, customers, products, ...) register here as they are built.

import { Router } from "express";

import healthRoutes from "./health.routes.js";

const router = Router();

router.use("/health", healthRoutes);

export default router;
