@GEMINI.md @PROJECT_CONTEXT.md @HANDOFF.md

ROLE: Act as a senior full-stack debugger specializing in 
React + Node.js + MySQL applications.

TASK: Audit the entire project and produce a complete 
broken-features report before any fixes are made.

Read every file in:
- /backend/routes/adminRoutes.js
- /backend/routes/citizenRoutes.js  
- /backend/routes/officerRoutes.js
- /backend/server.js
- /frontend/src/App.jsx or main.jsx
- /frontend/src/pages/auth/Login.jsx
- All citizen, officer, admin page components

For each file report:
1. Is it complete or partial?
2. What API endpoints does it call?
3. Do those endpoints exist in the backend?
4. Are there any obvious errors (undefined vars, 
   wrong imports, missing props)?
5. Is it linked in the router?

OUTPUT FORMAT:
## Backend Audit
- server.js: [status + issues]
- adminRoutes.js: [endpoints + issues]
- citizenRoutes.js: [endpoints + issues]
- officerRoutes.js: [endpoints + issues]

## Frontend Audit  
For each component:
- File: [name]
- Status: Complete / Partial / Broken
- Calls: [API endpoints it uses]
- Issues: [list of problems]

## Database Connection
- Is db connection configured correctly?
- Does .env have all required variables?

## Priority Fix List
Rank all issues: Critical / Important / Minor

Do not fix anything yet — audit only.