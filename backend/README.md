<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Chat Backend (NestJS + PostgreSQL)

This is a backend for a real-time chat application built with [NestJS](https://nestjs.com/) and [PostgreSQL](https://www.postgresql.org/). It supports authentication (JWT), file uploads, WebSocket messaging, and user/chat management.

## Features
- User registration and authentication (JWT)
- Real-time chat with WebSocket (Socket.IO)
- File uploads (images, etc.)
- REST API for users, chats, and messages
- PostgreSQL database (managed via Prisma ORM)
- Dockerized for easy local development

## Prerequisites
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Quick Start (Docker Compose)

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. **Copy and edit environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env if needed 
   ```

3. **Start the backend and database:**
   ```bash
   docker-compose up --build
   ```
   This will start both the NestJS backend and a PostgreSQL database.

4. **Apply database migrations:**
   In a new terminal, run:
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

5. **Access the API:**
   - REST API: [http://localhost:3000/api](http://localhost:3000/api)
   - Swagger docs: [http://localhost:3000/api](http://localhost:3000/api)
   - WebSocket: [ws://localhost:3001](ws://localhost:3001)
   - Uploaded files: [http://localhost:3000/uploads/](http://localhost:3000/uploads/)

## Useful Commands

- **Run migrations:**
  ```bash
  docker-compose exec backend npx prisma migrate deploy
  ```
- **Open a database shell:**
  ```bash
  docker-compose exec db psql -U postgres -d chatdb
  ```
- **Stop services:**
  ```bash
  docker-compose down
  ```

## Project Structure
- `src/` — main source code (modules, controllers, services, gateways)
- `prisma/` — Prisma schema and migrations
- `uploads/` — uploaded files
- `.env` — environment variables


## License
MIT

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

