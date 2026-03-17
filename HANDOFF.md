# Handoff — Current Broken State

## What Exists (half-built)
Frontend files present:
- admin/: AdminDashboard, AuditLogs, ManageOfficers, 
          ManageSchemes
- citizen/: ApplicationForm, BrowseSchemes, 
            CitizenDashboard, Grievance, MyDocuments,
            TrackDetails, TrackStatus
- officer/: OfficerDashboard, VerificationQueue
- auth/: Login

Backend files present:
- routes/: adminRoutes.js, citizenRoutes.js, 
           officerRoutes.js
- server.js, .env

## Known Issues
- Project cloned from Windows to Mac — paths may differ
- Many dashboard components show blank/broken UI
- Features not linked between frontend and backend
- Google OAuth may not be configured for Mac/local
- Database needs to be re-imported on Mac MySQL

## Fix Order (do NOT skip steps)
1. Audit all files → identify what's broken
2. Database → import SQL, verify connection
3. Backend → fix all API routes
4. Citizen dashboard → fix all citizen features
5. Officer dashboard → fix verification queue + actions
6. Admin dashboard → fix CRUD + audit logs
7. Auth → fix Google OAuth + RBAC routing
8. Integration → link all three portals together

## Environment Variables Needed (.env)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=welfare_system
PORT=5000
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
SESSION_SECRET=any_random_string
FRONTEND_URL=http://localhost:5173