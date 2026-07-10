# Database

> Placeholder — schema design will be added later.

## Engine

BusinessHub ERP uses **Microsoft SQL Server** (2022).

## Connection

Connection parameters are provided via environment variables (see
[`.env.example`](../.env.example)):

| Variable      | Description                    | Example      |
| ------------- | ----------------------------- | ------------ |
| `DB_HOST`     | Server hostname               | `localhost`  |
| `DB_PORT`     | Server port                   | `1433`       |
| `DB_NAME`     | Database name                 | `businesshub`|
| `DB_USER`     | Login user                    | `sa`         |
| `DB_PASSWORD` | Login password                | *(secret)*   |

## Scripts

| File                          | Purpose                                  |
| ----------------------------- | ---------------------------------------- |
| [`schema.sql`](../database/schema.sql) | Table definitions and constraints |
| [`seed.sql`](../database/seed.sql)     | Initial / sample data             |

## Planned Entities
- Users & Roles
- Customers
- Products
- Invoices & Invoice Items
- Inventory

The entity-relationship model will be documented here as it is designed.
