# API Reference

> Placeholder — full API documentation (Swagger/OpenAPI) will be added later.

## Base URL

```
http://localhost:5000/api
```

## Response Format

Every response uses a consistent envelope.

**Success**
```json
{
  "success": true,
  "message": "OK",
  "data": {  },
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

**Error**
```json
{
  "success": false,
  "message": "Not Found",
  "error": { "statusCode": 404, "details": null },
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Authentication

JWT-based. Register or log in to receive a token, then send it as a header:

```
Authorization: Bearer <token>
```

The token payload embeds the user's `roles` and `permissions`. Auth endpoints
are rate-limited (20 requests / 15 min / IP).

| Method | Endpoint             | Description                          | Auth |
| ------ | -------------------- | ------------------------------------ | ---- |
| POST   | `/api/auth/register` | Create an account (default `Employee` role) | No |
| POST   | `/api/auth/login`    | Authenticate, receive a JWT          | No   |
| GET    | `/api/auth/me`       | Current user profile + roles/permissions | Yes |

**Register / Login request**
```json
{ "email": "user@example.com", "password": "Sup3rSecret!", "firstName": "Ann", "lastName": "Lee" }
```

**Auth success response (`data`)**
```json
{
  "user": { "id": 1, "email": "user@example.com", "firstName": "Ann", "lastName": "Lee", "isActive": true },
  "roles": ["Employee"],
  "permissions": ["customers:view", "products:view", "..."],
  "token": "<jwt>"
}
```

Errors use the standard envelope: `400` (validation, with per-field `details`),
`401` (invalid credentials / token), `403` (disabled account), `409` (email
already registered), `429` (rate limit), `503` (database unavailable).

## Endpoints

### Health

| Method | Endpoint         | Description                        | Auth |
| ------ | ---------------- | --------------------------------- | ---- |
| GET    | `/api/health`    | Liveness — status and timestamp   | No   |
| GET    | `/api/health/db` | Database readiness (200 / 503)    | No   |

**Example response**
```json
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "service": "businesshub-server",
    "status": "ok",
    "environment": "development",
    "uptimeSeconds": 12.34
  },
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

### Customers

All endpoints require authentication and the matching `customers:*` permission.

| Method | Endpoint             | Permission          | Description                    |
| ------ | -------------------- | ------------------- | ------------------------------ |
| GET    | `/api/customers`     | `customers:view`    | List (paginated + search)      |
| GET    | `/api/customers/:id` | `customers:view`    | Get one                        |
| POST   | `/api/customers`     | `customers:create`  | Create                         |
| PUT    | `/api/customers/:id` | `customers:update`  | Update                         |
| DELETE | `/api/customers/:id` | `customers:delete`  | Delete                         |

**List query params:** `page` (default 1), `pageSize` (default 20, max 100),
`q` (search on name/email/company).

**Customer body**
```json
{
  "name": "Acme Corp",
  "email": "contact@acme.com",
  "phone": "+33 1 23 45 67 89",
  "company": "Acme",
  "addressLine": "1 Rue de la Paix",
  "city": "Paris",
  "country": "France",
  "notes": "VIP account",
  "isActive": true
}
```
Only `name` is required. `email`, when provided, must be unique (→ `409`).

**List response (`data`)**
```json
{
  "items": [ { "id": 1, "name": "Acme Corp", "email": "contact@acme.com", "isActive": true, "...": "..." } ],
  "pagination": { "page": 1, "pageSize": 20, "total": 42, "totalPages": 3 }
}
```

## Planned Endpoints
- `/api/products` *(product catalog)*
- `/api/inventory` *(inventory management)*
- `/api/invoices` *(invoicing)*

Detailed request/response schemas will be documented here and via Swagger.
