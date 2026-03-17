@GEMINI.md @PROJECT_CONTEXT.md @DB_SCHEMA.md @HANDOFF.md
[ATTACH: outputs/01_audit_output.md]
[ATTACH: backend/server.js current content]
[ATTACH: backend/routes/adminRoutes.js current content]
[ATTACH: backend/routes/citizenRoutes.js current content]
[ATTACH: backend/routes/officerRoutes.js current content]

ROLE: Act as a Node.js/Express backend engineer.

TASK: Fix all backend API routes. Enhance existing files,
do not rewrite from scratch unless completely broken.

FIX/IMPLEMENT:

server.js:
- CORS configured for http://localhost:5173
- express-session setup
- Passport Google OAuth middleware
- All 3 route files mounted correctly
- Error handling middleware at bottom

adminRoutes.js — ensure these endpoints exist:
- GET /api/admin/schemes — all schemes
- POST /api/admin/schemes — create scheme
- PUT /api/admin/schemes/:id — update scheme
- DELETE /api/admin/schemes/:id — delete scheme
- PUT /api/admin/schemes/:id/toggle — toggle isactive
- GET /api/admin/officers — all officers
- PUT /api/admin/officers/:id/status — suspend/activate
- GET /api/admin/auditlogs — all logs, newest first

citizenRoutes.js — ensure these endpoints exist:
- GET /api/citizen/schemes — active schemes only
- POST /api/citizen/apply — submit application
- GET /api/citizen/applications/:beneficiaryId — 
  user's applications with status timeline
- POST /api/citizen/grievance — submit ticket
- GET /api/citizen/documents/:beneficiaryId

officerRoutes.js — ensure these endpoints exist:
- GET /api/officer/queue/:officerId — pending applications
- PUT /api/officer/applications/:id/approve
- PUT /api/officer/applications/:id/reject
- GET /api/officer/applications/:id — full detail

SECURITY:
- All routes use parameterized queries
- No SQL string concatenation
- Every mutating route writes to auditlogs table

STOP CONDITIONS:
- All endpoints return correct data from MySQL
- Every route has try/catch with proper error response
- auditlogs written on every approve/reject/create/delete