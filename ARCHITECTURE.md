# Architecture Decisions

This repository implements a task management dashboard using Next.js 14 and Prisma.

## Key decisions

- **Next.js App Router**: chosen for modern routing, nested layouts, and built-in support for server components.
- **Server-side rendering for dashboard**: the dashboard page fetches user-specific data server-side to improve performance and SEO.
- **API routes within Next.js**: simplifies backend and frontend deployment by keeping both layers in one application.
- **JWT in httpOnly cookies**: improves security by preventing client-side script access to the authentication token.
- **Prisma ORM**: provides type-safe database access and aligns with the PostgreSQL schema.
- **Feature-based structure**: auth and task logic are separated into feature directories for modularity and scalability.
- **TanStack Query**: used for asynchronous task data fetching, caching, and optimistic UI updates.
- **Zod validation**: shared validation schemas help ensure consistent request handling on both client and server.
