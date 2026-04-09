# Gatherly Frontend

Frontend app for Gatherly - The Group Hangout Planner.

## 🛠 Tech Stack

- **Frontend Framework:** React
- **UI Library:** Material-UI (MUI)
- **Build Tool:** Vite
- **Language:** TypeScript

## Getting Started

1. **Clone the repository**

```bash
git clone <repo-url>
cd react-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the `react-app` directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Required environment variables:
- `VITE_API_URL` - Backend API base URL (default: `http://localhost:3000/api/v1`)
- `VITE_APP_URL` - Frontend application base URL for generating invite links (default: `http://localhost:5173`)

4. **Start the development server**

```bash
npm run dev
```

- The app will run at [http://localhost:5173](http://localhost:5173).
- Ensure the backend API is running at `http://localhost:3000` before using the app.

---

## 📜 Available Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Start development server with hot reload |
| `npm run build`  | Build for production                     |
| `npm run preview`| Preview production build locally         |
| `npm run lint`   | Lint source files with ESLint            |
| `npm run format` | Format code with Prettier                |

---

## 🚀 Available Routes

| Route           | Status          | Description                                |
| --------------- | --------------- | ------------------------------------------ |
| `/`             | ✅ Implemented  | Landing page                               |
| `/login`        | ✅ Implemented  | Login page with email/password auth        |
| `/signup`       | ✅ Implemented  | Sign-up page for new users                 |
| `/home`         | ✅ Implemented  | User dashboard with groups and actions     |
| `/profile`      | ✅ Implemented  | User profile management                    |
| `/creategroup`  | ✅ Implemented  | Create new group form                      |
| `/groups/:id`   | ✅ Implemented  | Group details with activities and voting   |
| `/invite/:code` | ✅ Implemented  | Join group via invite code                 |

**Note:** Google and Apple sign-in buttons, Manage Preferences, and Home statistics are marked as "Coming Soon" and will show informational messages when clicked.

---

## 📁 Project Structure

```text
src/
 ├─ assets/         # Images, logos, icons
 ├─ components/     # Reusable components (Layout, Navbar, Modals, Snackbars)
 ├─ features/       # Feature-specific modules
 │   ├─ auth/           # Authentication components (Login, Signup, AuthOptions)
 │   ├─ groups/         # Group management components
 │   └─ activities/     # Activity and voting components
 ├─ hooks/          # Custom hooks
 ├─ pages/          # Page components (Landing, Home, Profile, etc.)
 ├─ providers/      # Context providers (AuthProvider)
 ├─ utils/          # Helper functions, constants, utilities
 ├─ theme.ts        # MUI theme configuration
 ├─ App.tsx         # Main app routing
 └─ main.tsx        # App entry point

```

---

## ✨ Features

### Authentication
- User registration with name, email, and password
- Secure login with JWT token storage
- Protected routes requiring authentication
- Profile management (view and update user info)
- Account deletion

### Groups
- Create groups with name and description
- Generate unique 6-character invite codes
- Join groups using invite codes
- View all groups you're a member of
- Group creator privileges (edit, delete, finalize)
- Leave groups (non-creators only)
- Finalize groups to lock decisions

### Activities
- Propose activities within groups
- Vote on favorite activities
- Real-time vote counting
- Activity creator can edit/delete their own activities
- Group creator can set winner activity
- View winner activity for finalized groups

### UI/UX
- Responsive Material-UI design
- Snackbar notifications for user feedback
- "Coming Soon" indicators for future features
- Protected and guest route handling
- Confirmation modals for destructive actions

---

## 🔐 Authentication Flow

1. **Registration**: User creates account → API returns JWT token → Token stored in localStorage
2. **Login**: User authenticates → API returns JWT token → Token stored in localStorage
3. **Protected Routes**: AuthProvider checks for valid token → Redirects to login if missing
4. **Logout**: Token removed from localStorage → User redirected to landing page

The `AuthProvider` context manages authentication state and provides `user` and `token` to all components.

---
