# Database

BusinessHub ERP uses **Microsoft SQL Server** (2022). This page documents the
connectivity foundation and conventions. No business tables exist yet — they are
added per feature milestone via migrations.

## Connection

Parameters come from environment variables (see [`.env.example`](../.env.example)):

| Variable                      | Default        | Description                              |
| ----------------------------- | -------------- | ---------------------------------------- |
| `DB_HOST`                     | `localhost`    | Server hostname                          |
| `DB_PORT`                     | `1433`         | Server port                              |
| `DB_NAME`                     | `businesshub`  | Database name                            |
| `DB_USER`                     | `sa`           | Login user                               |
| `DB_PASSWORD`                 | *(secret)*     | Login password (strong SA password)      |
| `DB_ENCRYPT`                  | `false`        | Encrypt connection (`true` in prod/Azure)|
| `DB_TRUST_SERVER_CERTIFICATE` | `true`         | Trust self-signed cert (local/dev)       |
| `DB_POOL_MAX` / `DB_POOL_MIN` | `10` / `0`     | Connection pool size                     |
| `DB_CONNECTION_TIMEOUT_MS`    | `15000`        | Connect timeout                          |

## Connection pool

`businesshub-server/src/database/pool.js` manages a single shared `mssql`
connection pool:

- `connectDatabase()` — connect (or reuse); rejects if unreachable.
- `getPool()` — the live pool for repositories/queries.
- `checkDatabaseConnection()` — safe probe used by the health endpoint.
- `closeDatabase()` — closes the pool on shutdown.

The API **does not** crash if SQL Server is unavailable at startup; it logs a
warning and keeps running. Readiness is reported by:

```
GET /api/health/db   ->  200 { database: "connected" }  |  503 (not reachable)
```

## Schema conventions

| Aspect         | Convention                                                        |
| -------------- | ----------------------------------------------------------------- |
| Schema         | `dbo`                                                              |
| Table names    | `PascalCase`, plural (e.g. `Customers`, `InvoiceItems`)           |
| Column names   | `PascalCase` (e.g. `FirstName`, `UnitPrice`)                      |
| Primary key    | `Id INT IDENTITY(1,1) PRIMARY KEY`                                |
| Foreign keys   | `<Entity>Id` (e.g. `CustomerId`) with a `FOREIGN KEY` constraint  |
| Timestamps     | `CreatedAt` / `UpdatedAt` `DATETIME2 DEFAULT SYSUTCDATETIME()`    |
| Strings        | `NVARCHAR` (Unicode)                                               |
| Money          | `DECIMAL(18, 2)`                                                   |
| Booleans       | `BIT`                                                             |

## Migrations

SQL migrations live in [`database/migrations/`](../database/migrations/) and are
applied by the backend runner:

```bash
cd businesshub-server
npm run db:migrate
```

- Files: `NNNN_description.sql`, applied in ascending filename order.
- Applied files are tracked in a `__migrations` table (idempotent re-runs).
- Each file runs in a transaction; write single-batch, idempotent DDL (no `GO`).

See [`database/migrations/README.md`](../database/migrations/README.md) for
authoring rules.

## Local SQL Server via Docker

```bash
# from the repo root, with .env configured (strong DB_PASSWORD)
docker compose up -d database
docker compose ps        # wait until 'database' is healthy
```

Then run migrations and check readiness at `GET /api/health/db`.

## Scripts

| File                                        | Purpose                       |
| ------------------------------------------- | ----------------------------- |
| [`schema.sql`](../database/schema.sql)      | Reference schema (placeholder)|
| [`seed.sql`](../database/seed.sql)          | Seed data (placeholder)       |
| [`migrations/`](../database/migrations/)    | Versioned migrations          |
