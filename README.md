# TaskFlow — Task Management Dashboard

A production-ready task management application built with Next.js 14, TypeScript, TanStack Query, ShadCN UI, Tailwind CSS, and PostgreSQL.

## Repository Contents

This repository includes:

- Complete source code in `src/`
- Next.js API routes under `src/app/api/`
- Prisma schema and database configuration in `prisma/`
- `README.md` with setup instructions
- `.env.example` for environment variables
- `package.json` and build scripts for development, production, and database tasks

## Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript
- **Styling**: Tailwind CSS, ShadCN UI primitives
- **Data fetching**: TanStack Query
- **Forms/validation**: React Hook Form + Zod
- **Backend**: Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens stored in httpOnly cookies

## Environment Setup

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database

### Install dependencies

```bash
git clone <your-repo>
cd task-manager
npm install
```

### Configure environment variables

Copy `.env.example` to `.env.local` or `.env` and update values:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: at least 32 characters for token signing
- `NEXTAUTH_URL`: local application URL for auth redirects

### Generate Prisma client and initialize the database

```bash
npx prisma generate
npx prisma db push
```

If you prefer migrations:

```bash
npx prisma migrate dev --name init
```

### Start the application

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── login/route.ts
│   │   ├── logout/route.ts
│   │   └── register/route.ts
│   ├── api/tasks/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── dashboard/page.tsx
│   ├── login/page.tsx
│   └── register/page.tsx
├── components/
│   ├── navbar.tsx
│   ├── providers.tsx
│   └── ui/
├── features/
│   ├── auth/
│   └── tasks/
├── hooks/
├── lib/
├── services/
├── types/
└── middleware.ts
```

## Architecture Decisions

- **App Router + Server Components**: Uses Next.js App Router for structured routing and server-rendered dashboard data.
- **API route backend**: Lightweight backend within the same Next.js app, simplifying deployment and local development.
- **JWT in httpOnly cookies**: Limits exposure to XSS and keeps auth tokens out of client-side storage.
- **Prisma for data access**: Ensures type-safe database queries and a consistent schema definition.
- **Feature-based file organization**: Keeps auth and task logic grouped by feature for maintainability.
- **TanStack Query**: Provides caching, stale data handling, and optimistic updates for responsive task management.

## Assumptions

- Each user manages a private task list, with no shared workspace or user-to-user collaboration.
- Tasks are a single resource owned by a user and do not require complex relationships.
- Authentication is session-based via JWT cookies; refresh tokens are not implemented.
- The app is intended for small-scale productivity use rather than enterprise task management.

## Deployment Notes

- This app is ready for Vercel deployment.
- Ensure environment variables are configured in the hosting platform.
- The database should be accessible from the deployed app.

## Useful Commands

- `npm run dev` — start development server
- `npm run build` — production build
- `npm start` — start built app
- `npm run lint` — run ESLint
- `npm run format` — format code with Prettier
- `npm run db:generate` — Prisma client generate
- `npm run db:push` — push schema to database
- `npm run db:migrate` — create Prisma migrations
