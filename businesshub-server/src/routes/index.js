// API router aggregator.
//
// Single place where feature routers are mounted under the `/api` prefix.
// New modules (auth, customers, products, ...) register here as they are built.

import { Router } from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import customerRoutes from "./customer.routes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/customers", customerRoutes);

export default router;
