import { Router } from "express";

const router = Router();

// GET /api/health - simple liveness check
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "businesshub-server",
    timestamp: new Date().toISOString(),
  });
});

export default router;
