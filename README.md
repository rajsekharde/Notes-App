# Notes App — Full Stack (FastAPI + React + PostgreSQL + Docker + Traefik)

This is a fully containerized full-stack Notes Application built using:

- **FastAPI** (Backend)
- **React + Vite** (Frontend)
- **PostgreSQL** (Database)
- **Alembic** (Migrations)
- **Docker + Docker Compose** (Environment Orchestration)
- **Traefik** (Reverse Proxy / Routing)

---

## Features
- User authentication (with refresh tokens)
- Create / Update / Delete notes
- Persistent PostgreSQL storage
- Reverse proxy using Traefik
- Dockerized frontend and backend
- Automatic Alembic migrations
- Production-ready architecture

---

## Running the App (Local)

### 1. Install Docker & Docker Compose  
Make sure Docker Desktop is running.

### 2. Start the whole stack

```bash
docker compose up --build -d
```

### 3. Access the App

Frontend: http://localhost:8080

Backend API: http://localhost:8080/api

Healthcheck: http://localhost:8080/api/health

To stop everything:

```bash
docker compose down --volumes
```

## Project Structure
/frontend     → React app (served by Nginx)
 /backend     → FastAPI app
 /db          → PostgreSQL data (persisted via Docker volumes)
 /alembic     → Database migrations
 docker-compose.yml

## Technologies

FastAPI

SQLModel

Alembic

PostgreSQL

React (Vite)

Traefik

Docker

## Future Plans

HTTPS using Let’s Encrypt via Traefik

Deployment on AWS / DigitalOcean

CI/CD with GitHub Actions

Multi-project hosting on single VPS

## License

MIT


---
