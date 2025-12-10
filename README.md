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
- Deployed using AWS EC2

---

## Running the App (Local)

### 1. Install Docker & Docker Compose  
Make sure Docker Desktop is running.

### 2. Start the whole stack

Create a .env file in root project folder.
Add the following variables:
```bash
POSTGRES_USER=username
POSTGRES_PASSWORD=password
POSTGRES_DB=notes_db

SECRET_KEY=any_random_string

ACCESS_TOKEN_EXPIRE_MINS=10
REFRESH_TOKEN_EXPIRE_DAYS=7

ADMIN_PASSWORD=12345 # Use it to login using Admin Email- MainAdmin@mail.com

DATABASE_URL=postgresql+psycopg2://username:password@db:5432/notes_db

FRONTEND_URL=http://localhost

BACKEND_PORT=8000
```

Then run in root folder terminal:
```bash
docker compose -f docker-compose.yml -f traefik.dev.yml up --build -d
```

### 3. Access the App

Frontend: http://localhost:8080

Backend API: http://localhost:8080/api

Healthcheck: http://localhost:8080/api/health

To stop everything:

```bash
docker compose down --volumes
```

## Deploying to AWS EC2 Instance:
Launch an EC2 instance with Ubuntu 22.04
Add a new DNS record to your domain:
```bash
Type: A
Content: <Public IPv4 address of ec2 Instance>
```
Clone repository
Change .yml scripts to include your sub-domain name and email.

SSH into the instance
Install docker, docker-compose, git
Make a new directory:
```bash
mkdir Notes-App
cd Notes-App
```
Clone Git repo to ec2 instance:
```bash
git clone https://github.com/rajsekharde/Notes-App.git
cd Notes-App
```
Create .env file:
```bash
nano .env
```
Create the same environment variables mentioned in the beginning.
Then:
```bash
Ctrl + O
Enter
Ctrl + X
```
Build docker containers:
```bash
docker compose -f docker-compose.yml -f traefik.prod.yml up --build -d
```
Check status of containers & backend logs:
```bash
docker ps
docker logs -f notes_backend
```
To stop the containers:
```bash
docker compose down
```

## Project Structure
/frontend     → React app (served by Nginx)
/backend     → FastAPI app
docker-compose.yml
traefik.dev.yml
traefik.prod.yml
.env

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
