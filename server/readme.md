# Gatherly - Backend

Backend API for the Gatherly - The Group Hangout Planner.

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
```bash
    todo
```

5. **Start development server**
```bash
   npm run dev
```

Server runs at `http://localhost:3000`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes (dev only) |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

---

## API Endpoints

### Health Checks
```
GET  /health              Server health check
GET  /api/v1/health       API health check
GET  /api/v1/unknown      Error 404 response
```

**Example Success Response:**
```json
{
  "success": true,
  "message": "API is running",
  "version": "v1"
}
```

---

## Project Structure
```
server/
├── src/
│   ├── config/          # Configuration (database, logger)
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Express middlewares
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   ├── validators/      # Request validation schemas
│   ├── app.ts           # Express app setup
│   └── server.ts        # Entry point
├── prisma/
│   └── schema.prisma    # Database schema
├── .env.example
├── package.json
└── tsconfig.json
```

---

## Database Setup

Todo

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `API_VERSION` | API version prefix | `v1` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |

---