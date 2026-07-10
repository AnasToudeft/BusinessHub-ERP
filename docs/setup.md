# Setup Guide

This guide explains how to run BusinessHub ERP locally for development.

## Prerequisites
- [Node.js](https://nodejs.org/) 18+ and npm
- [Git](https://git-scm.com/)
- (Optional) [Docker](https://www.docker.com/) for containerized SQL Server
- [Visual Studio Code](https://code.visualstudio.com/) (recommended)

## 1. Clone the repository
```bash
git clone <your-repo-url>
cd BusinessHub-ERP
```

## 2. Configure environment variables
```bash
cp .env.example .env
```
Then edit `.env` with your local values.

## 3. Backend
```bash
cd businesshub-server
npm install
npm run dev
```
- Runs on `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

## 4. Frontend
Open a second terminal:
```bash
cd businesshub-client
npm install
npm run dev
```
- Runs on `http://localhost:5173`

## 5. (Optional) Docker
A placeholder `docker-compose.yml` is provided for the frontend, backend, and
SQL Server services. Dockerfiles are not implemented yet.

```bash
docker compose up
```

## Opening in VS Code
```bash
code .
```
Open the root `BusinessHub-ERP` folder. The client and server are independent
npm projects and can each be installed and run separately.
