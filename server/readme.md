# Gatherly - Backend

> REST API server for **Gatherly**, the group hangout planner. Built with Node.js, Express, TypeScript, and PostgreSQL via Prisma ORM.

## Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM

---

## Getting Started

### Prerequisites

- Node.js v18 or higher
- PostgreSQL 14+
- npm

### Installation

1. **Clone and navigate to the project**

```bash
   cd server
```

2. **Install dependencies**

```bash
   npm install
```

3. **Setup environment variables**

```bash
   cp .env.example .env
```

Update `.env` with your database credentials:

```env
   NODE_ENV=development
   PORT=3000
   API_VERSION=v1
   DATABASE_URL="postgresql://user:password@localhost:5433/gatherly"
   CORS_ORIGIN=http://localhost:5173
```

4. **Setup database**

    **Option A: Using Docker (Recommended)**

```bash
   # Start PostgreSQL container
   docker run -d \
     --name gatherly-db \
     -e POSTGRES_USER=gatherly_user \
     -e POSTGRES_PASSWORD=gatherly_password \
     -e POSTGRES_DB=gatherly \
     -p 5433:5432 \
     -v gatherly_postgres_data:/var/lib/postgresql/data \
     postgres:14-alpine

   # Wait for database to be ready
   sleep 5

   # Verify connection
   docker exec -it gatherly-db psql -U gatherly_user -d gatherly -c "SELECT version();"
```

**Option B: Using Local PostgreSQL**

```bash
   # Create database
   createdb gatherly

   # Update DATABASE_URL in .env to use port 5432
   DATABASE_URL="postgresql://your_user:your_password@localhost:5432/gatherly"
```

4.2 **Run Prisma migrations**

```bash
   # Generate Prisma client
   npm run db:generate

   # Create database tables
   npm run db:migrate
   # When prompted, name it: "init"
```

4.3 **Verify setup (Optional)**

```bash
   # Open Prisma Studio to view database
   npm run db:studio
   # Opens at http://localhost:5555

   # Or check with psql
   docker exec -it gatherly-db psql -U gatherly_user -d gatherly -c "\dt"
```

5. **Start development server**

```bash
   npm run dev
```

Server runs at `http://localhost:3000`

---

## Available Scripts

| Command               | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Start development server with hot reload |
| `npm run build`       | Compile TypeScript to JavaScript         |
| `npm start`           | Start production server                  |
| `npm run lint`        | Lint source files with ESLint            |
| `npm run lint:fix`    | Auto-fix lint issues                     |
| `npm run db:generate` | Generate Prisma client                   |
| `npm run db:migrate`  | Run database migrations                  |
| `npm run db:push`     | Push schema changes (dev only)           |
| `npm run db:studio`   | Open Prisma Studio (database GUI)        |

---

## API Endpoints

### Auth

| Method   | Path                    | Auth   | Description                         |
| -------- | ----------------------- | ------ | ----------------------------------- |
| `POST`   | `/api/v1/auth/register` | Public | Register with name, email, password |
| `POST`   | `/api/v1/auth/login`    | Public | Login with email and password       |
| `GET`    | `/api/v1/auth/me`       | Bearer | Get authenticated user's profile    |
| `PUT`    | `/api/v1/auth/profile`  | Bearer | Update authenticated user's profile |
| `DELETE` | `/api/v1/auth/account`  | Bearer | Delete authenticated user's account |

### Groups

All group endpoints require a Bearer token. Routes marked **Creator only** additionally require the authenticated user to be the group's creator.

| Method   | Path                       | Access        | Description                                          |
| -------- | -------------------------- | ------------- | ---------------------------------------------------- |
| `POST`   | `/api/v1/groups`           | Bearer        | Create a group; creator is auto-enrolled as Admin    |
| `GET`    | `/api/v1/groups`           | Bearer        | List all groups the authenticated user is a member of |
| `GET`    | `/api/v1/groups/:id`       | Member        | Get full group details including members list        |
| `PUT`    | `/api/v1/groups/:id`       | Creator only  | Update group name and/or description                 |
| `DELETE` | `/api/v1/groups/:id`       | Creator only  | Delete the group                                     |
| `POST`   | `/api/v1/groups/join`      | Bearer        | Join a group using its invite code                   |
| `POST`   | `/api/v1/groups/:id/unjoin`| Member        | Leave a group (creator cannot leave their own group) |

**Join group request body:**
```json
{ "inviteCode": "A1B2C3" }
```

### System

| Method | Path      | Description        |
| ------ | --------- | ------------------ |
| `GET`  | `/health` | Server health check |

**Standard success response envelope:**

```json
{
    "success": true,
    "message": "Description of result",
    "data": { }
}
```

**Standard error response envelope:**

```json
{
    "success": false,
    "message": "Error description",
    "errors": [ { "field": "email", "message": "Invalid email" } ]
}
```

---

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration (database, logger, constants)
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Express middlewares
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── types/           # Shared TypeScript interfaces
│   ├── utils/           # Helper functions
│   ├── validators/      # Request validation schemas
│   ├── app.ts           # Express app setup
│   └── server.ts        # Entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── .env.example         # Sample fields for Env var
├── package.json
└── tsconfig.json
```

---

## Environment Variables

| Variable       | Description                                  | Default                 |
| -------------- | -------------------------------------------- | ----------------------- |
| `NODE_ENV`     | Environment mode                             | `development`           |
| `PORT`         | Server port                                  | `3000`                  |
| `API_VERSION`  | API version prefix                           | `v1`                    |
| `DATABASE_URL` | PostgreSQL connection string                 | Required                |
| `CORS_ORIGIN`  | Allowed frontend origin                      | `http://localhost:5173` |
| `JWT_SECRET`     | 128-character hex string for signing JWTs    | Required                |
| `JWT_EXPIRES_IN` | Token validity duration                      | `7d`                    |

---

## Database Management

### Useful Commands

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Create a new migration
npm run db:migrate

# Push schema changes without migration (dev only)
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### Docker Database Commands

```bash
# Start database
docker start gatherly-db

# Stop database
docker stop gatherly-db

# View logs
docker logs gatherly-db

# Connect to database
docker exec -it gatherly-db psql -U gatherly_user -d gatherly

# Backup database
docker exec gatherly-db pg_dump -U gatherly_user gatherly > backup.sql

# Restore database
docker exec -i gatherly-db psql -U gatherly_user -d gatherly < backup.sql
```

---

### Common Issues

**Issue: Port 5432 already in use**

```bash
# Check what's using the port
lsof -i :5432

# If you have local PostgreSQL, stop it
brew services stop postgresql

# Or use different port for Docker (already configured as 5433)
```

**Issue: Database connection refused**

```bash
# Check if Docker container is running
docker ps

# Restart container
docker restart gatherly-db
```

**Issue: Permission denied errors**

```bash
# Reconnect to database and run
docker exec -it gatherly-db psql -U gatherly_user -d gatherly

# Inside psql:
GRANT ALL ON SCHEMA public TO gatherly_user;
ALTER SCHEMA public OWNER TO gatherly_user;
\q
```
