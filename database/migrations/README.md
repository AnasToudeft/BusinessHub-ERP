# Migrations

SQL migrations applied by the backend runner (`npm run db:migrate` from
`businesshub-server`). No business tables exist yet — feature milestones add
their migrations here.

## How it works
- Each migration is a `.sql` file in this folder.
- Files are applied in **ascending filename order**.
- Applied files are recorded in a `__migrations` table; re-running only applies
  new files.
- Each file runs inside a **transaction**.

## Naming
```
NNNN_short_description.sql      e.g. 0001_create_users.sql
```
Use a zero-padded, incrementing prefix so ordering is stable.

## Authoring rules
- Write each file as a **single batch** — do not use `GO` separators.
- Prefer **idempotent** DDL so a partially-applied/re-run file is safe:
  ```sql
  IF OBJECT_ID('dbo.Users', 'U') IS NULL
  CREATE TABLE dbo.Users ( ... );
  ```
- Follow the conventions in [`docs/database.md`](../../docs/database.md).
