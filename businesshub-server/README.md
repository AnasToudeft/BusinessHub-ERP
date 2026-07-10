# BusinessHub ERP — Backend

Node.js / Express REST API for BusinessHub ERP.

## Requirements
- Node.js 18+
- npm

## Setup
```bash
npm install
```

Copy the root environment template and adjust values:
```bash
cp ../.env.example .env
```

## Running
```bash
npm run dev     # development (nodemon, auto-reload)
npm start       # production
```

The server runs on `http://localhost:5000` by default.

## Environment
Configuration is read and validated once at startup by `src/config/env.js`.
Invalid values (e.g. a non-numeric `PORT`) cause the process to fail fast with a
clear message.

| Variable      | Default       | Description                                   |
| ------------- | ------------- | --------------------------------------------- |
| `NODE_ENV`    | `development` | `development` \| `production` \| `test`       |
| `PORT`        | `5000`        | HTTP port                                     |
| `CORS_ORIGIN` | `*`           | Allowed CORS origin                           |

## Application Foundation
The Express app is composed from small, single-responsibility pieces:

- **Security**: `helmet` (secure headers) and configurable `cors`.
- **Request logging**: lightweight per-request logger (`middleware/requestLogger.js`).
- **Routing**: feature routers are aggregated in `routes/index.js` under `/api`.
- **404 handling**: unmatched routes forward a structured 404 (`middleware/notFound.js`).
- **Error handling**: a single error handler (`middleware/errorHandler.js`) formats
  all errors; `ApiError` (`utils/ApiError.js`) carries HTTP status + details.
- **Response format**: every response uses one envelope via `utils/apiResponse.js`.

### Consistent response envelope
Success:
```json
{ "success": true, "message": "OK", "data": { }, "timestamp": "..." }
```
Error:
```json
{ "success": false, "message": "Not Found", "error": { "statusCode": 404, "details": null }, "timestamp": "..." }
```

## Endpoints
| Method | Endpoint      | Description        |
| ------ | ------------- | ------------------ |
| GET    | `/`           | API root info      |
| GET    | `/api/health` | Health check       |

## Structure
```
src/
├── config/         # App & environment configuration
├── controllers/    # Request handlers
├── database/       # DB connection & queries
├── middleware/     # Express middleware
├── models/         # Data models / entities
├── repositories/   # Data access layer
├── routes/         # Route definitions
├── services/       # Business logic
├── utils/          # Shared helpers
├── validators/     # Request validation
├── app.js          # Express app setup
└── server.js       # Entry point
```

## Planned
- JWT authentication & bcrypt
- SQL Server integration
- Swagger / OpenAPI docs
- Customer, product, invoice, and inventory modules
