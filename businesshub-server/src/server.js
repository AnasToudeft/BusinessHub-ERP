import dotenv from "dotenv";

import app from "./app.js";

// Load environment variables from .env
dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`BusinessHub ERP API running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
