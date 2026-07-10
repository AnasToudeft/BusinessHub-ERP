# BusinessHub ERP

A modern, full-stack ERP (Enterprise Resource Planning) platform designed as a
professional portfolio project. BusinessHub ERP demonstrates clean architecture,
a layered backend, and a component-driven React frontend.

> **Status:** Project scaffolding / first commit. No business modules implemented yet.

## Purpose

BusinessHub ERP aims to provide a foundation for managing core business
operations — customers, products, invoices, and inventory — through a secure,
well-structured web application. This repository currently contains only the
clean project skeleton, base configuration, and documentation needed to start
development.

## Tech Stack

### Frontend (`businesshub-client`)
- React (bootstrapped with Vite)
- React Router
- Axios
- CSS Modules
- Responsive design

### Backend (`businesshub-server`)
- Node.js
- Express.js
- Microsoft SQL Server
- JWT authentication *(planned)*
- bcrypt password hashing *(planned)*
- Swagger / OpenAPI documentation *(planned)*

### Tooling
- Git
- Docker / Docker Compose
- Visual Studio Code

## Repository Structure

```
BusinessHub-ERP/
├── businesshub-client/   # React frontend (Vite)
├── businesshub-server/   # Node.js / Express backend
├── database/             # SQL schema and seed scripts
├── docs/                 # Architecture and setup documentation
├── docker-compose.yml    # Multi-service orchestration (frontend, backend, SQL Server)
├── .env.example          # Environment variable template
└── .gitignore
```

## Getting Started

Each application is installed and run independently.

### Backend
```bash
cd businesshub-server
npm install
npm run dev
```
The API starts on `http://localhost:5000` with a health check at
`http://localhost:5000/api/health`.

### Frontend
```bash
cd businesshub-client
npm install
npm run dev
```
The client starts on `http://localhost:5173`.

See [`docs/setup.md`](docs/setup.md) for full setup instructions.

## Documentation
- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Database](docs/database.md)
- [Setup Guide](docs/setup.md)

## License

This project is provided for educational and portfolio purposes.
