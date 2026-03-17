@GEMINI.md @PROJECT_CONTEXT.md @HANDOFF.md
[ATTACH: outputs/01_audit_output.md]
[ATTACH: frontend/src/pages/officer/ — all files]

ROLE: Act as a React frontend engineer.

TASK: Fix the entire Officer portal.

FIX EACH FILE:

OfficerDashboard.jsx:
- Summary: total assigned, pending count, 
  approved today, rejected today
- Quick link to VerificationQueue
- Fetch officer's stats from backend

VerificationQueue.jsx:
- Fetch GET /api/officer/queue/:officerId
- Table columns: Applicant Name, Scheme, 
  Applied On, Status, Actions
- Actions column: "Review" button → opens detail view
- Filter by status (Pending / All)
- Real-time looking (polling every 30s or manual refresh)

Application Detail View (modal or separate page):
- Show: applicant name, email, Aadhaar, income, category
- Show: scheme name, description, max_income
- Show: applied date
- Show: uploaded documents (view link)
- Two buttons: Approve (green) + Reject (red)
- Confirm dialog before action
- PUT to /api/officer/applications/:id/approve or reject
- After action: remove from queue, show success toast

RULES:
- Table must handle empty queue gracefully
- Approve/Reject must be instant optimistic update
- Both actions must write to auditlogs via backend
- Officer cannot approve their own test data 
  (basic check)