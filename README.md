# Gatherly - Group Hangout Planner

[![CI](https://github.com/mikkosio/group-planner-app/actions/workflows/ci.yml/badge.svg)](https://github.com/mikkosio/group-planner-app/actions/workflows/ci.yml)

Gatherly is a full-stack web application that helps groups plan hangouts through collaborative activity voting. Users can create groups, propose activities, vote on their favorites, and finalize plans—all in one streamlined platform.

## 🛠 Tech Stack

**Frontend:**
- React 19 + TypeScript
- Material-UI (MUI) v7
- Vite
- React Router v7
- Axios for API calls

**Backend:**
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Zod validation

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- PostgreSQL 14+
- npm

### Installation

1. **Clone the repository**

```bash
git clone <repo-url>
cd group-planner-app
```

2. **Set up the backend**

```bash
cd server
npm install
cp .env.example .env
```

Update `.env` with your database credentials:

```env
NODE_ENV=development
PORT=3000
API_VERSION=v1
DATABASE_URL="postgresql://user:password@localhost:5433/gatherly"
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=your-128-character-hex-string
JWT_EXPIRES_IN=7d
```

3. **Set up the database**

Using Docker (recommended):

```bash
cd server
docker run -d \
  --name gatherly-db \
  -e POSTGRES_USER=gatherly_user \
  -e POSTGRES_PASSWORD=gatherly_password \
  -e POSTGRES_DB=gatherly \
  -p 5433:5432 \
  -v gatherly_postgres_data:/var/lib/postgresql/data \
  postgres:14-alpine

# Run migrations
npm run db:generate
npm run db:migrate
```

4. **Set up the frontend**

```bash
cd react-app
npm install
cp .env.example .env
```

Update `.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_APP_URL=http://localhost:5173
```

5. **Run the application**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd react-app
npm run dev
```

- Backend API: http://localhost:3000
- Frontend App: http://localhost:5173

## 📁 Project Structure

```
group-planner-app/
├── react-app/          # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature modules (auth, groups, activities)
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Helper functions
│   │   └── providers/      # Context providers (Auth, etc.)
│   └── README.md       # Frontend documentation
│
├── server/             # Backend Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Express middlewares
│   │   ├── validators/     # Request validation schemas
│   │   └── config/         # Configuration
│   ├── prisma/         # Database schema and migrations
│   └── readme.md       # Backend documentation
│
└── README.md           # This file

```

## 📚 Documentation

- **[Frontend Documentation](react-app/README.md)** - React app setup, routes, and features
- **[Backend Documentation](server/readme.md)** - API endpoints, database setup, and deployment

## ✨ Features

- **User Authentication** - Secure registration and login with JWT (Epic 1)
- **Group Management** - Create groups, generate invite codes, manage members (Epic 2)
- **Activity Voting** - Propose activities, vote on favorites, track preferences (Epic 2-3)
- **Group Finalization** - Lock in decisions and select winner activities (Epic 3)

## 🔑 Key Concepts

- **Groups**: Social units that plan hangouts together. Each group has a creator and members.
- **Activities**: Proposed hangout ideas within a group. Members vote on their preferences.
- **Voting**: Members can vote for activities they like. Votes help determine the winner.
- **Finalization**: Groups can be finalized by the creator, making activities read-only and locking in the winner.

## 🌐 Environment Variables

### Frontend (react-app/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api/v1` |
| `VITE_APP_URL` | Frontend base URL for invite links | `http://localhost:5173` |

### Backend (server/.env)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `API_VERSION` | API version prefix | `v1` |
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `CORS_ORIGIN` | Allowed frontend origin | `http://localhost:5173` |
| `JWT_SECRET` | Secret for signing JWTs (128-char hex) | Required |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` |

## 🛠 Development

### Run Tests

```bash
# Frontend tests
cd react-app
npm run test

# Backend tests
cd server
npm run test
```

### Linting

```bash
# Frontend
cd react-app
npm run lint

# Backend
cd server
npm run lint
```

### Database Management

```bash
cd server

# Open Prisma Studio (database GUI)
npm run db:studio

# Create a new migration
npm run db:migrate

# Reset database (WARNING: deletes all data)
npm run db:reset
```

## 📝 API Overview

The API is RESTful and uses JWT Bearer token authentication for protected routes.

**Base URL:** `http://localhost:3000/api/v1`

**Main Resources:**
- `/auth` - User registration, login, profile management
- `/groups` - Group CRUD, join/unjoin, finalization
- `/groups/:id/activities` - Activity management and voting

For complete API documentation, see [Backend README](server/readme.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is developed as part of an academic coursework at BCIT.
