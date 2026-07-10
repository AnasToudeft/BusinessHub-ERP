# Architecture

> Placeholder — to be expanded as the project grows.

## Overview

BusinessHub ERP follows a classic **client–server** architecture with a clear
separation between the presentation layer (React) and the application layer
(Node.js / Express), backed by Microsoft SQL Server.

```
┌──────────────────┐      HTTPS/REST     ┌──────────────────┐      TDS      ┌───────────────┐
│  React Frontend  │  ───────────────▶   │  Express Backend │  ──────────▶  │  SQL Server   │
│  (businesshub-   │  ◀───────────────   │  (businesshub-   │  ◀──────────  │  (database)   │
│   client)        │      JSON           │   server)        │               │               │
└──────────────────┘                     └──────────────────┘               └───────────────┘
```

## Backend Layering

The backend is organized into clear responsibilities:

| Layer         | Folder          | Responsibility                                  |
| ------------- | --------------- | ----------------------------------------------- |
| Routes        | `routes/`       | Map HTTP endpoints to controllers               |
| Controllers   | `controllers/`  | Handle requests/responses, orchestrate services |
| Services      | `services/`     | Business logic                                  |
| Repositories  | `repositories/` | Data access / SQL queries                        |
| Models        | `models/`       | Data shapes and entities                        |
| Middleware    | `middleware/`   | Auth, validation, error handling                |
| Validators    | `validators/`   | Request payload validation                      |
| Config        | `config/`       | Environment and app configuration               |
| Utils         | `utils/`        | Shared helpers                                  |

## Frontend Structure

The frontend is component-driven, with pages composed from reusable components,
shared layouts, contexts for global state, custom hooks, and an Axios-based
service layer for API calls.

## Planned Concerns
- JWT-based authentication and route protection
- Role-based authorization
- Centralized error handling and logging
- OpenAPI/Swagger documentation
