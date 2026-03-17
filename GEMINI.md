# Project: Government Welfare Eligibility & Tracking System

## Stack (never deviate)
- Frontend: React.js (Vite) + React Router DOM
- Styling: Custom CSS, Fluent UI / minimalist design
- Backend: Node.js + Express.js
- Database: MySQL (relational, strict foreign keys)
- API: Axios for frontend-backend communication
- Auth: Google OAuth (citizen login)

## Project Structure
- /backend — Express server, routes, DB connection
- /frontend/src — React SPA
- /frontend/src/pages/admin — Admin portal
- /frontend/src/pages/citizen — Citizen portal
- /frontend/src/pages/officer — Officer portal
- /frontend/src/pages/auth — Login

## Three Roles (RBAC)
- Citizen: Google OAuth login, apply for schemes, track status
- Officer: View/approve/reject applications queue
- Admin: CRUD schemes, manage officers, view audit logs

## Database
- MySQL database name: welfare_system
- Tables: admins, officers, individualbeneficiaries,
  welfareschemes, currentapplications, auditlogs
- All foreign keys enforced

## Code Rules
- Every backend route: auth check → validation → DB query → response
- All MySQL queries use parameterized statements (no string concat)
- Frontend: every API call has loading state + error handling
- No hardcoded credentials anywhere
- Use .env for all secrets

## What NOT to do
- Do not switch to MongoDB or any other DB
- Do not use TypeScript (project is plain JS)
- Do not rewrite working files from scratch
- Do not use any CSS framework — custom CSS only
- Do not skip error handling on any API call