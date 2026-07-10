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
