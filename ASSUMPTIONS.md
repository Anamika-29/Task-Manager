# Assumptions Made

This project is built with the following assumptions in mind:

- Each user has their own private task list and cannot view other users' tasks.
- No real-time collaboration features are required.
- Task data is managed through CRUD operations only.
- Authentication is handled with JWT tokens stored in httpOnly cookies.
- Token refresh and multi-device session management are not implemented.
- The app supports a single PostgreSQL database instance.
- The UI is intended for a personal productivity dashboard rather than a large enterprise system.
