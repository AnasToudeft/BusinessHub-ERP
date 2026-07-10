# API Reference

> Placeholder — full API documentation (Swagger/OpenAPI) will be added later.

## Base URL

```
http://localhost:5000/api
```

## Endpoints

### Health

| Method | Endpoint      | Description                        | Auth |
| ------ | ------------- | ---------------------------------- | ---- |
| GET    | `/api/health` | Returns API status and a timestamp | No   |

**Example response**
```json
{
  "status": "ok",
  "service": "businesshub-server",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```

## Planned Endpoints
- `POST /api/auth/login`, `POST /api/auth/register` *(authentication)*
- `/api/customers` *(customer management)*
- `/api/products` *(product catalog)*
- `/api/invoices` *(invoicing)*
- `/api/inventory` *(inventory management)*

Detailed request/response schemas will be documented here and via Swagger.
