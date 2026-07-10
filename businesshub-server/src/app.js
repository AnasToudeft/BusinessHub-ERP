// Express application factory: wires middleware, routes and error handling.
// No server binding here (see server.js) so the app stays easy to test.

import express from "express";
import cors from "cors";
import helmet from "helmet";

import config from "./config/env.js";
import apiRoutes from "./routes/index.js";
import requestLogger from "./middleware/requestLogger.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// API routes (mounted under /api)
app.use("/api", apiRoutes);

// Service identity at the root
app.get("/", (req, res) => {
  res.json({
    service: "businesshub-server",
    message: "BusinessHub ERP API",
    health: "/api/health",
  });
});

// Centralized 404 + error handling — must remain the last middleware.
app.use(notFound);
app.use(errorHandler);

export default app;
