import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.routes.js";

// Create and configure the Express application.
const app = express();

// Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", healthRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ service: "businesshub-server", message: "BusinessHub ERP API" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

export default app;
