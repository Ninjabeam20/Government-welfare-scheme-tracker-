@GEMINI.md @PROJECT_CONTEXT.md @HANDOFF.md
[ATTACH: backend/server.js]
[ATTACH: frontend/src/pages/auth/Login.jsx]
[ATTACH: frontend/src/App.jsx]

ROLE: Act as an auth engineer specializing in 
Passport.js Google OAuth and React Router RBAC.

TASK: Fix authentication and role-based routing.

IMPLEMENT:

Backend auth (server.js / authRoutes.js):
- Passport Google OAuth 2.0 strategy
- On Google callback: check if email exists in 
  individualbeneficiaries → role = 'citizen'
  Check if email exists in officers → role = 'officer'
  Check if email exists in admins → role = 'admin'
  Store { userId, role, name, email } in session
- GET /api/auth/me → return session user
- GET /api/auth/logout → destroy session
- Callback redirects to frontend with role info

Frontend (App.jsx):
- ProtectedRoute component: checks session role
- Routes:
  / → Login
  /citizen/* → requires role='citizen'
  /officer/* → requires role='officer'  
  /admin/* → requires role='admin'
- Wrong role → redirect to /unauthorized page
- No session → redirect to /login

Login.jsx:
- Single "Sign in with Google" button
- After OAuth: fetch /api/auth/me
- Redirect based on role:
  citizen → /citizen/dashboard
  officer → /officer/dashboard
  admin → /admin/dashboard
- Show error if email not registered in system

STOP CONDITIONS:
- Each role sees ONLY their portal
- Direct URL access to wrong portal redirects away
- Logout clears session and returns to login