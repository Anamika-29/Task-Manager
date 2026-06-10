# TaskFlow — Task Management Dashboard

A production-ready Task Management application built with Next.js 14, TypeScript, TanStack Query, ShadCN UI, Tailwind CSS, and PostgreSQL.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, TanStack Query, ShadCN UI, Tailwind CSS
- **Backend**: Next.js API Routes, Zod validation
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT via `jose` library (httpOnly cookies)

## Getting Started

### 1. Clone and Install

```bash
git clone <your-repo>
cd task-manager
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
```

> **Tip**: Use [Railway](https://railway.app) or [Neon](https://neon.tech) for a free hosted PostgreSQL database.

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push   # or: npx prisma migrate dev
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                  # Next.js App Router pages + API routes
│   ├── api/auth/         # Register, Login, Logout endpoints
│   ├── api/tasks/        # CRUD task endpoints
│   ├── dashboard/        # Dashboard page (server component)
│   ├── login/            # Login page
│   └── register/         # Register page
├── components/           # Shared UI components (Navbar, Providers)
│   └── ui/               # ShadCN primitives
├── features/             # Feature-based modules
│   ├── auth/components/  # LoginForm, RegisterForm
│   └── tasks/components/ # TaskCard, TaskList, TaskFormDialog, StatsCards
├── hooks/                # Custom React hooks (use-tasks, use-auth, use-toast)
├── lib/                  # Core utilities (prisma, auth, validations, utils)
├── services/             # API call abstractions (auth.service, task.service)
├── types/                # TypeScript interfaces
└── middleware.ts          # Route protection
```

## Architecture Decisions

- **App Router + Server Components**: Dashboard page fetches initial user data server-side; interactive task UI runs client-side.
- **JWT in httpOnly cookies**: More secure than localStorage; protected from XSS.
- **Prisma + PostgreSQL**: Type-safe ORM with excellent DX; schema migrations via Prisma Migrate.
- **TanStack Query**: Optimistic updates on task toggle/delete for instant UI feedback.
- **Feature-based structure**: Each feature (auth, tasks) is self-contained; scales well as the app grows.
- **Zod validation**: Shared schemas between frontend (react-hook-form) and backend API routes.

## Deployment (Vercel)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy — Vercel auto-detects Next.js

## Assumptions

- Single-user tasks: each user only sees their own tasks
- No real-time collaboration (no WebSockets needed)
- Authentication uses JWT tokens valid for 7 days
