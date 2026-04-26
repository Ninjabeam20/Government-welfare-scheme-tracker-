# PROJECT_CONTEXT — Government Welfare System

## What This App Does
A centralized digital welfare governance platform with 3 portals:

CITIZEN PORTAL:
- Google OAuth login
- Browse active welfare schemes
- Apply for schemes with document upload
- Track application status in real-time (timeline)
- Manage document vault (reusable identity proofs)
- Submit grievance tickets

OFFICER PORTAL:
- View assigned pending applications queue
- Review applicant details and documents
- Approve or Reject applications (updates citizen timeline)

ADMIN PORTAL:
- Create/edit/delete welfare schemes
- Set eligibility: max_income, isactive toggle
- View all officers, suspend/activate accounts
- View audit logs (read-only, all system actions)

## Current State
Project is half-built, cloned from Windows to Mac.
Many features broken or blank.
Goal: fix dashboard by dashboard, fully linked.

## Database
MySQL — welfare_system database
Tables: admins, officers, individualbeneficiaries,
welfareschemes, currentapplications, auditlogs

## Environment
- Mac (git cloned from Windows)
- Running locally
- MySQL via XAMPP or MySQL Workbench
- Node.js backend on port 5000
- React Vite frontend on port 5173

## Phase Boundaries
MVP (now): All 3 portals working end-to-end
Post-MVP: DBT payments, SMS notifications, 
          algorithmic eligibility filtering