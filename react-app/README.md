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

---

## 🚀 Available Routes

| Route      | Status             | Description  |
| ---------- | ------------------ | ------------ |
| `/`        | ✅ Working         | Landing page |
| `/login`   | ⚠️ Not Functional  | Login page   |
| `/signup`  | ⚠️ Not Functional  | Sign-up page |
| `/home`    | ⚠️ Not Functional  | Home page    |
| `/profile` | ❌ Not implemented | Profile page |

---

## 📁 Project Structure

```text
src/
 ├─ assets/         # Images, logos, icons
 ├─ components/     # Reusable components
 ├─ features/       # Feature-specific modules
 ├─ hooks/          # Custom hooks
 ├─ pages/          # Page components
 ├─ utils/          # Helper functions, constants, utilities
 ├─ App.tsx         # Main app routing
 └─ index.tsx       # App entry point

```
