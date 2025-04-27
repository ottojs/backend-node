# boilerplate-backend-node

Boilerplate code for Backend (Node.js)

## Basics

### Install Dependencies and Test

```bash
npm install;
# Tests use the SQLite database
npm run test;
```

### Database

Use Docker (or Podman preferably) Compose to bring up a PostgreSQL database.

```bash
# Docker
docker compose up -d;

# Podman
podman compose up -d;
```

### Environment Variables

Feel free to edit these files to change settings.  
By the way, we intentionally do NOT use dotenv, as misuse can leak credentials.

```bash
# macOS / Linux / Unix
source ./env.dev.sh;

# Windows PowerShell
.\env.dev.ps1;
```

### Running Server

```bash
npm start;
```

## Docker / Podman

### Building

```bash
podman build -t "backend:latest" --ulimit nofile=4096:4096 .;
```

### Running

```bash
podman run --rm -it -p 8080:8080 -e NODE_ENV="development" -e LISTEN="0.0.0.0" -e SQL_URI="postgresql://localuser:localroot@postgresql:5432/localdb?connect_timeout=10&sslmode=disable" --network boilerplate-backend-node_appnet backend:latest;
```

## Tests

### Individual Tests

```bash
npm run test -- ./test/unit/lib/random_hex.test.js
```
