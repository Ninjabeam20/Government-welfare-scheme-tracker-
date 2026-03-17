@GEMINI.md @PROJECT_CONTEXT.md @HANDOFF.md
[ATTACH: outputs/01_audit_output.md]
[ATTACH: frontend/src/pages/citizen/ — all files]

ROLE: Act as a React frontend engineer.

TASK: Fix the entire Citizen portal. 
Enhance existing files, show complete corrected versions.

FIX EACH FILE:

CitizenDashboard.jsx:
- Show welcome message with citizen name
- Summary cards: total applications, pending, approved
- Quick links to Browse Schemes and Track Status
- Fetch data from /api/citizen/applications/:id

BrowseSchemes.jsx:
- Fetch GET /api/citizen/schemes (active only)
- Show scheme cards with name, description, max_income
- "Apply Now" button on each card → goes to ApplicationForm
- Loading skeleton while fetching
- Empty state if no schemes

ApplicationForm.jsx:
- Pre-filled scheme name from route params
- Fields: Aadhaar, Income, Category, document upload
- POST to /api/citizen/apply
- Success → redirect to TrackStatus
- Validation: all fields required

TrackStatus.jsx:
- Fetch GET /api/citizen/applications/:beneficiaryId
- Show list of all applications
- Each shows scheme name + current Status badge
- Clicking one → goes to TrackDetails

TrackDetails.jsx:
- Show full timeline for one application:
  Submitted → Pending eKYC → Under Review → 
  Approved/Rejected
- Each stage has timestamp if available
- Color coded: green=approved, red=rejected, 
  blue=in progress

MyDocuments.jsx:
- List uploaded documents
- Upload new document button
- Show filename, upload date, type

Grievance.jsx:
- Form: subject + description textarea
- POST to /api/citizen/grievance
- Show submitted tickets list below

RULES:
- Every component: loading state + error state + 
  empty state
- All API calls use Axios
- Use React Router Link for navigation
- No inline styles — use className with CSS