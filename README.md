# Chat App

A full-stack real-time chat application built with NestJS (backend), React + Vite (frontend), and PostgreSQL as the database. The backend uses Prisma ORM for database management and supports authentication, file uploads, and WebSocket messaging. The project is fully dockerized for easy local development.

## Features

- User authentication (JWT)
- Real-time chat with WebSocket (Socket.IO)
- REST API for users, chats, and messages
- File uploads (images, etc.)
- PostgreSQL database managed via Prisma ORM
- Frontend built with React and Vite
- Dockerized for easy setup and development

## Prerequisites

- Docker and Docker Compose

## Quick Start (Docker Compose)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd chat
   ```

2. **Copy and edit environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env # if exists
   # Edit .env files if needed
   ```

3. **Start all services:**
   ```bash
   docker-compose up --build
   ```
   This will start the backend (NestJS), frontend (React), and a PostgreSQL database.

4. **Apply database migrations:**
   In a new terminal, run:
   ```bash
   docker-compose exec app npx prisma migrate deploy
   ```

5. **Access the app:**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api
   - Swagger docs: http://localhost:3000/api
   - WebSocket: ws://localhost:3001
   - Uploaded files: http://localhost:3000/uploads/

## Project Structure

- `backend` — NestJS backend (API, WebSocket, uploads, Prisma)
- `frontend` — React frontend (Vite)
- `docker-compose.yml` — Docker Compose configuration

## Useful Commands

- **Run migrations:**
  ```bash
  docker-compose exec app npx prisma migrate deploy
  ```
- **Open a database shell:**
  ```bash
  docker-compose exec db psql -U postgres -d postgres
  ```
- **Stop services:**
  ```bash
  docker-compose down
  ```
