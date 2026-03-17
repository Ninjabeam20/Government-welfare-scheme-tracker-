@GEMINI.md @PROJECT_CONTEXT.md @HANDOFF.md
[ATTACH: outputs/01_audit_output.md]
[ATTACH: frontend/src/pages/admin/ — all files]

ROLE: Act as a React frontend engineer.

TASK: Fix the entire Admin portal.

FIX EACH FILE:

AdminDashboard.jsx:
- Stats cards: total schemes, active schemes, 
  total officers, active officers, total applications
- Recent activity feed from auditlogs (last 10)
- Quick links to ManageSchemes, ManageOfficers, AuditLogs

ManageSchemes.jsx:
- Table: SchemeName, Description, max_income, 
  isactive toggle, Edit, Delete
- isactive toggle: PUT /api/admin/schemes/:id/toggle
  Instant visual feedback
- Add New Scheme button → inline form or modal:
  Fields: SchemeName, Description, max_income, isactive
  POST /api/admin/schemes
- Edit inline or modal: PUT /api/admin/schemes/:id
- Delete with confirmation: DELETE /api/admin/schemes/:id
- All changes reflected immediately in table

ManageOfficers.jsx:
- Table: Name, Email, Department, Status, Actions
- Status badge: green=Active, red=Suspended
- Toggle button: Suspend/Activate
  PUT /api/admin/officers/:id/status
- No ability to delete officers (only suspend)

AuditLogs.jsx:
- Read-only table: ActorType, ActionDetails, ActionTime
- Newest first
- GET /api/admin/auditlogs
- Pagination: show 20 per page
- Filter by ActorType (Admin/Officer/Citizen)
- No edit or delete — strictly read-only

RULES:
- All CRUD operations update UI immediately 
  (optimistic or refetch)
- Confirm dialog on all destructive actions
- Admin actions must write to auditlogs via backend