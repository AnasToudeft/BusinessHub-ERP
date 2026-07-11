// Simple, dependency-free SQL migration runner.
//
// Strategy: each migration is a `.sql` file in `database/migrations/`, named
// `NNNN_description.sql` (applied in ascending filename order). Applied files
// are recorded in a `__migrations` table so re-running only applies new ones.
// Each file runs inside a transaction (write migrations as a single batch — no
// `GO` separators — and prefer idempotent DDL, e.g. `IF NOT EXISTS`).
//
// Usage: npm run db:migrate

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { connectDatabase, closeDatabase, sql } from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, "../../../database/migrations");

const TRACKING_TABLE_DDL = `
IF OBJECT_ID('dbo.__migrations', 'U') IS NULL
  CREATE TABLE dbo.__migrations (
    Name      NVARCHAR(255) NOT NULL PRIMARY KEY,
    AppliedAt DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
  );
`;

function readMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort();
}

async function runMigrations() {
  const pool = await connectDatabase();
  await pool.request().query(TRACKING_TABLE_DDL);

  const appliedResult = await pool.request().query("SELECT Name FROM dbo.__migrations");
  const applied = new Set(appliedResult.recordset.map((row) => row.Name));

  const pending = readMigrationFiles().filter((file) => !applied.has(file));

  if (pending.length === 0) {
    console.log("[migrate] No pending migrations.");
    return;
  }

  for (const file of pending) {
    const sqlText = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    const transaction = new sql.Transaction(pool);
    await transaction.begin();
    try {
      await new sql.Request(transaction).batch(sqlText);
      await new sql.Request(transaction)
        .input("name", sql.NVarChar, file)
        .query("INSERT INTO dbo.__migrations (Name) VALUES (@name)");
      await transaction.commit();
      console.log(`[migrate] Applied ${file}`);
    } catch (err) {
      await transaction.rollback();
      throw new Error(`Failed to apply migration ${file}: ${err.message}`);
    }
  }

  console.log(`[migrate] Done. Applied ${pending.length} migration(s).`);
}

runMigrations()
  .catch((err) => {
    console.error(`[migrate] Error: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(() => closeDatabase());
