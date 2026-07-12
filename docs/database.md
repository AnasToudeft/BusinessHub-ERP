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

## Authentication & Authorization (RBAC)

Introduced by migrations `0001_create_auth_schema.sql` (schema) and
`0002_seed_auth_rbac.sql` (default data).

```
 Users  ──< UserRoles >──  Roles  ──< RolePermissions >──  Permissions
   │                         │                                  │
 Email(UQ)                Name(UQ)                          Code(UQ)
 PasswordHash             Description                       Description
 First/LastName
 IsActive
```

| Table             | Purpose                              | Key columns                          |
| ----------------- | ------------------------------------ | ------------------------------------ |
| `Users`           | Application accounts                 | `Email` (unique), `PasswordHash`     |
| `Roles`           | Named roles                          | `Name` (unique)                      |
| `Permissions`     | Fine-grained rights (`resource:action`) | `Code` (unique)                   |
| `UserRoles`       | Users ↔ Roles (N:N)                  | PK `(UserId, RoleId)`                |
| `RolePermissions` | Roles ↔ Permissions (N:N)            | PK `(RoleId, PermissionId)`          |

Join-table foreign keys use `ON DELETE CASCADE`. `PasswordHash` stores a bcrypt
hash (populated once backend auth lands in Milestone 6).

### Default roles

| Role       | Permissions                                                             |
| ---------- | ----------------------------------------------------------------------- |
| `Admin`    | All permissions (incl. `users:*`, `roles:*`)                            |
| `Manager`  | `view` / `create` / `update` on business data (customers, products, inventory, invoices, reports); no deletes, no user/role admin |
| `Employee` | `view` on business data                                                 |

Permission codes follow `resource:action` (e.g. `customers:view`,
`invoices:create`). New modules add their permissions in later migrations.

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
