# MERN Todo App — Clean Architecture

A full-stack Todo application built with **Express + TypeScript + MongoDB + React** using **Clean Architecture / DDD** patterns.

## 📁 Project Structure

```
Backend/
├── server/          # Express + TypeScript backend
│   ├── src/
│   │   ├── domain/          # Core business rules (zero dependencies)
│   │   ├── application/     # Use cases & orchestration
│   │   ├── infrastructure/  # Database, JWT, bcrypt implementations
│   │   ├── presentation/    # Express routes, controllers, middlewares
│   │   ├── shared/          # Utilities, types, constants
│   │   └── main/            # App bootstrap & server startup
│   ├── scripts/             # DB seed scripts
│   ├── package.json
│   └── tsconfig.json
│
├── client/          # React + Vite + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Auth, Todos, Layout components
│   │   ├── context/         # Auth context
│   │   ├── services/        # Axios API service
│   │   └── pages/           # Login, Signup, Dashboard
│   ├── package.json
│   └── vite.config.ts
│
└── package.json     # Root scripts (convenience)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Install All Dependencies
```bash
npm run install:all
```

### Start Backend (Terminal 1)
```bash
npm run dev:server
# or: cd server && npm run dev
```

### Start Frontend (Terminal 2)
```bash
npm run dev:client
# or: cd client && npm run dev
```

### Seed Database (Optional)
```bash
npm run seed
```
Demo account: `demo@example.com` / `password123`

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/api/auth/signup` | ❌ | Register |
| POST | `/api/auth/login` | ❌ | Login |
| GET | `/api/auth/me` | ✅ | Profile |
| GET | `/api/todos` | ✅ | List todos |
| POST | `/api/todos` | ✅ | Create todo |
| PUT | `/api/todos/:id` | ✅ | Update todo |
| DELETE | `/api/todos/:id` | ✅ | Delete todo |

## 🔧 Tech Stack
- **Backend**: Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod
- **Frontend**: React, Vite, TypeScript, Axios, React Router
- **Architecture**: Clean Architecture / DDD
# backend-Learning
