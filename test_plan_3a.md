<div class="page-title">

# Government Welfare Eligibility & Tracking System
### Laboratory-10: Comprehensive Test Plan Document — Part III-A

<br>

**Sections Covered:** 7. Suspension & Resumption · 8. Testing Materials · 9. Test Cases (Subsystems 1 & 2)

</div>

<div style="page-break-after: always;"></div>

---

# 7. Suspension and Resumption Criteria

## 7.1 Suspension Criteria

Testing activities shall be **immediately suspended** upon the occurrence of any of the following conditions:

| ID | Condition | Severity | Action Required |
|----|-----------|----------|-----------------|
| SC-01 | **Backend server crash** — The Express.js server at `http://localhost:5000` becomes unresponsive or throws an unrecoverable exception. | Critical | Restart the backend server via `node server.js`. Verify database connectivity before resuming. |
| SC-02 | **Database connectivity failure** — The MySQL `welfare_system` database becomes unreachable, or the connection pool exhausts all 10 connections without release. | Critical | Restart MySQL daemon. Verify connectivity via `SELECT 1` health check at `/api/health`. Re-seed database if corruption is suspected. |
| SC-03 | **Google OAuth service outage** — Google's authorization servers are unavailable, preventing authentication flow testing. | Major | Monitor Google Cloud Status Dashboard. Defer Authentication subsystem tests until service restoration. Proceed with non-auth tests using pre-established sessions. |
| SC-04 | **Seed data corruption** — Test data in the database deviates from the expected seed state (e.g., missing schemes, altered officer records), causing cascading test failures. | Major | Re-execute `seed-database.sql` to restore the database to its deterministic baseline state. |
| SC-05 | **Severity-1 defect discovered** — A critical defect (system crash, data loss, security breach) is identified during test execution. | Critical | Log the defect with full reproduction steps. Halt all testing until the defect is triaged and resolved by the development team. |
| SC-06 | **Frontend build failure** — The Vite development server fails to compile, preventing UI-based system testing. | Major | Resolve compilation errors. Restart via `npm run dev`. White-Box API tests may continue independently. |

## 7.2 Resumption Criteria

Testing shall **resume** only when ALL of the following conditions are verified:

1. **Environment Stability** — Both the frontend server (`http://localhost:5173`) and backend server (`http://localhost:5000`) are operational and responding to requests.
2. **Database Integrity** — The `welfare_system` database has been re-seeded to its baseline state, confirmed by verifying the existence of all 6 tables and expected seed records.
3. **Health Check Verification** — `GET http://localhost:5000/api/health` returns `{"status": "success", "message": "Backend running"}`.
4. **Defect Resolution** — Any Severity-1 defects that triggered suspension have been resolved and verified.
5. **Session Clean State** — All browser sessions and cookies have been cleared to prevent stale authentication state from contaminating tests.

<div style="page-break-after: always;"></div>

---

# 8. Testing Materials (Hardware/Software Requirements)

## 8.1 Hardware Requirements

| Component | Minimum Specification | Recommended Specification |
|-----------|-----------------------|---------------------------|
| Processor | Intel Core i3 / Apple M1 | Intel Core i5+ / Apple M1 Pro+ |
| RAM | 4 GB | 8 GB+ |
| Storage | 500 MB free disk space | 1 GB+ free disk space |
| Network | Localhost loopback (127.0.0.1) | Active internet connection (for Google OAuth) |
| Display | 1280 × 720 resolution | 1920 × 1080 resolution |

## 8.2 Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| **Node.js** | 18.x+ | Backend runtime environment for Express.js server |
| **npm** | 9.x+ | Package manager for dependency installation |
| **MySQL Server** | 8.x | Relational database hosting the `welfare_system` schema |
| **MySQL Workbench** (or CLI) | Latest | Database inspection, query execution, and state verification |
| **Google Chrome** | Latest Stable | Primary browser for Black-Box system testing |
| **Postman** | Latest | API endpoint testing tool for White-Box unit/integration tests |
| **Visual Studio Code** (optional) | Latest | Source code inspection for White-Box path analysis |
| **Git** | 2.x+ | Version control for source code access |

## 8.3 Software Dependencies (npm Packages)

| Package | Role in Testing |
|---------|----------------|
| `express` | Web framework under test |
| `mysql2/promise` | Database driver — SQL query correctness validation |
| `passport` + `passport-google-oauth20` | OAuth authentication strategy under test |
| `express-session` | Session management under test |
| `cors` | Cross-Origin Resource Sharing policy under test |
| `multer` | File upload middleware (out of scope but installed) |
| `dotenv` | Environment variable management |
| `axios` | Frontend HTTP client under test |
| `react-router-dom` | Client-side routing under test |

## 8.4 Test Environment Setup Procedure

```bash
# 1. Start MySQL and seed the database
mysql -u root -p < seed-database.sql

# 2. Start the backend server
cd backend
node server.js
# Expected: "Database connected" + "Unified Server running on http://localhost:5000"

# 3. Start the frontend server
cd frontend
npm run dev
# Expected: "Local: http://localhost:5173"

# 4. Verify health
curl http://localhost:5000/api/health
# Expected: {"status":"success","message":"Backend running"}
```

<div style="page-break-after: always;"></div>

---

# 9. Test Cases

> **Notation:** Each test case includes a unique ID, description, pre-conditions, step-by-step procedure, expected result, and a Pass/Fail column. Screenshot placeholders are embedded at critical verification points.

---

## 9.1 Subsystem 1: Authentication & Access Control

### 9.1.1 Unit Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| AUTH-UT-01 | Verify `/auth/me` returns user object for authenticated session | Backend running. A valid session exists (user previously logged in via OAuth). | 1. Open Postman. 2. Send `GET http://localhost:5000/auth/me` with session cookie attached. 3. Inspect response body. | Response: `200 OK`. Body contains `{userId, role, name, email}` matching the logged-in user. | |
| | | | | [INSERT SCREENSHOT: Postman showing 200 response from /auth/me with user object] | |
| AUTH-UT-02 | Verify `/auth/me` returns 401 for unauthenticated request | Backend running. No active session (fresh browser/Postman with no cookies). | 1. Open Postman (new session, no cookies). 2. Send `GET http://localhost:5000/auth/me`. 3. Inspect response. | Response: `401 Unauthorized`. Body: `{"message": "Not logged in"}`. | |
| | | | | [INSERT SCREENSHOT: Postman showing 401 response from /auth/me] | |
| AUTH-UT-03 | Verify `/auth/logout` destroys session | Backend running. User is authenticated with an active session. | 1. Send `GET http://localhost:5000/auth/logout` with session cookie. 2. Inspect response. 3. Send `GET /auth/me` again. | Logout response: `200 OK`, Body: `{"success": true}`. Subsequent `/auth/me` returns `401`. | |
| | | | | [INSERT SCREENSHOT: Postman showing logout success response followed by 401 on /auth/me] | |
| AUTH-UT-04 | Verify `serializeUser` persists complete user object | Backend running. Inspect `server.js` source code lines 74-75. | 1. Review `passport.serializeUser((user, done) => done(null, user))`. 2. Confirm the entire user object is serialized (not just an ID). | The serialize function passes the complete `{userId, role, name, email}` object to `done()`. Session stores all role information. | |
| | | | | [INSERT SCREENSHOT: Code snippet of serializeUser/deserializeUser in server.js] | |

### 9.1.2 Integration Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| AUTH-IT-01 | Verify OAuth callback resolves Admin role | Backend + DB running. `admin@govt.in` exists in `admins` table. | 1. Open browser. 2. Navigate to `http://localhost:5000/auth/google`. 3. Authenticate with the Google account mapped to `admin@govt.in`. 4. Observe redirect URL. | Browser redirects to `http://localhost:5173/admin/dashboard`. Session cookie is set with `role: 'admin'`. | |
| | | | | [INSERT SCREENSHOT: Browser URL bar showing /admin/dashboard after OAuth login] | |
| AUTH-IT-02 | Verify OAuth callback resolves Officer role | Backend + DB running. `aarti@govt.in` exists in `officers` table. | 1. Navigate to `http://localhost:5000/auth/google`. 2. Authenticate with Google account mapped to `aarti@govt.in`. 3. Observe redirect. | Redirects to `http://localhost:5173/officer/dashboard`. | |
| | | | | [INSERT SCREENSHOT: Browser URL bar showing /officer/dashboard after OAuth login] | |
| AUTH-IT-03 | Verify OAuth callback resolves Citizen role | Backend + DB running. `john@example.com` exists in `individualbeneficiaries`. | 1. Navigate to `http://localhost:5000/auth/google`. 2. Authenticate with Google account mapped to `john@example.com`. 3. Observe redirect. | Redirects to `http://localhost:5173/citizen/dashboard`. | |
| | | | | [INSERT SCREENSHOT: Browser URL bar showing /citizen/dashboard after OAuth login] | |
| AUTH-IT-04 | Verify session cookie persistence across requests | User is authenticated. | 1. Login via OAuth. 2. Send `GET /auth/me` — note the `userId`. 3. Wait 5 seconds. 4. Send `GET /auth/me` again. | Both requests return identical user objects, proving session persistence. Cookie `maxAge` is 24 hours. | |
| | | | | [INSERT SCREENSHOT: Two consecutive Postman /auth/me responses showing identical data] | |
| AUTH-IT-05 | Verify RBAC: Citizen cannot access Officer endpoints | User authenticated as Citizen (`role: 'citizen'`). | 1. Login as Citizen. 2. Send `GET http://localhost:5000/api/officer/queue/1` with citizen session cookie. 3. Inspect response. | The request should either return `401/403` or return data that is structurally unrelated to the citizen's own data, depending on middleware implementation. This validates cross-role boundary testing. | |
| | | | | [INSERT SCREENSHOT: Postman response when citizen session tries to access officer queue endpoint] | |

### 9.1.3 System Tests (Black-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| AUTH-ST-01 | End-to-end Google OAuth login for Citizen | Frontend + Backend running. Browser cookies cleared. | 1. Open `http://localhost:5173`. 2. Click "Login with Google" button. 3. Select a registered Google account. 4. Wait for redirect. | Google consent screen appears. After authentication, user is redirected to the Citizen Dashboard. Dashboard displays the user's name and welcome message. | |
| | | | | [INSERT SCREENSHOT: Citizen Dashboard showing logged-in user name after Google OAuth] | |
| AUTH-ST-02 | End-to-end logout flow | User is logged in and viewing their dashboard. | 1. Click the "Logout" button on the dashboard. 2. Observe the redirect. 3. Attempt to navigate back to the dashboard URL directly. | User is redirected to the login page. Direct URL access to dashboard is denied or redirects back to login. | |
| | | | | [INSERT SCREENSHOT: Login page displayed after logout, confirming session termination] | |
| AUTH-ST-03 | First-time user auto-registration | Backend + DB running. Use a Google account whose email does NOT exist in any table. | 1. Clear browser cookies. 2. Navigate to `http://localhost:5173`. 3. Click "Login with Google". 4. Authenticate with a new Google account. 5. Verify redirect to Citizen Dashboard. 6. Check `individualbeneficiaries` table in MySQL. | User is redirected to Citizen Dashboard. A new row appears in `individualbeneficiaries` with the Google account's Name and Email, `Aadhaar = NULL`, `Income = 0`, `Category = 'General'`. | |
| | | | | [INSERT SCREENSHOT: MySQL Workbench showing the newly auto-registered citizen row in individualbeneficiaries] | |

---

## 9.2 Subsystem 2: Citizen Enrollment & Profile Management

### 9.2.1 Unit Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| ENRL-UT-01 | Verify `GET /api/citizen/profile/:id` returns correct profile | Backend + DB running. Citizen `BeneficiaryID = 1` exists (seeded as John Doe). | 1. Open Postman. 2. Send `GET http://localhost:5000/api/citizen/profile/1`. 3. Inspect response body. | Response: `200 OK`. Body: `{"BeneficiaryID": 1, "Name": "John Doe", "Email": "john@example.com", "Income": 45000, "Category": "General"}`. | |
| | | | | [INSERT SCREENSHOT: Postman response showing John Doe's profile data from /api/citizen/profile/1] | |
| ENRL-UT-02 | Verify profile endpoint returns 404 for non-existent ID | Backend running. No citizen with `BeneficiaryID = 9999`. | 1. Send `GET http://localhost:5000/api/citizen/profile/9999`. 2. Inspect response. | Response: `404 Not Found`. Body: `{"message": "Not found"}`. | |
| | | | | [INSERT SCREENSHOT: Postman showing 404 response for non-existent BeneficiaryID] | |
| ENRL-UT-03 | Verify `Email` UNIQUE constraint at database level | MySQL Workbench open. `john@example.com` already exists. | 1. Execute SQL: `INSERT INTO individualbeneficiaries (Name, Email, Aadhaar, Income, Category) VALUES ('Duplicate', 'john@example.com', '999999999999', 0, 'General');` 2. Observe error. | MySQL returns `ERROR 1062 (23000): Duplicate entry 'john@example.com' for key 'Email'`. Insertion is rejected. | |
| | | | | [INSERT SCREENSHOT: MySQL Workbench showing duplicate key error on Email column] | |
| ENRL-UT-04 | Verify `Aadhaar` UNIQUE constraint at database level | MySQL Workbench open. Aadhaar `123456789012` already exists (John Doe). | 1. Execute SQL: `INSERT INTO individualbeneficiaries (Name, Email, Aadhaar, Income, Category) VALUES ('Test', 'new@test.com', '123456789012', 0, 'General');` 2. Observe error. | MySQL returns `ERROR 1062 (23000): Duplicate entry '123456789012' for key 'Aadhaar'`. Insertion is rejected. | |
| | | | | [INSERT SCREENSHOT: MySQL Workbench showing duplicate key error on Aadhaar column] | |

### 9.2.2 Integration Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| ENRL-IT-01 | Verify auto-registration inserts correct data on first login | Backend + DB running. Use Google account with email NOT in any table. | 1. Note current row count: `SELECT COUNT(*) FROM individualbeneficiaries;`. 2. Trigger OAuth login with new Google account. 3. After redirect to Citizen Dashboard, query: `SELECT * FROM individualbeneficiaries ORDER BY BeneficiaryID DESC LIMIT 1;`. | New row inserted with: `Name` = Google display name, `Email` = Google email, `Aadhaar = NULL`, `Income = 0.00`, `Category = 'General'`. Row count incremented by 1. | |
| | | | | [INSERT SCREENSHOT: MySQL query result showing newly inserted beneficiary row with NULL Aadhaar and Income = 0] | |
| ENRL-IT-02 | Verify returning citizen does NOT create duplicate | Backend + DB running. Citizen `john@example.com` exists. | 1. Note `BeneficiaryID` for John Doe: `SELECT BeneficiaryID FROM individualbeneficiaries WHERE Email='john@example.com';`. 2. Login via OAuth with John's Google account. 3. Re-run the same query. 4. Verify row count unchanged. | `BeneficiaryID` remains the same. No duplicate row created. Total row count in `individualbeneficiaries` is unchanged. | |
| | | | | [INSERT SCREENSHOT: MySQL showing same BeneficiaryID before and after re-login, no duplicates] | |
| ENRL-IT-03 | Verify OAuth callback correctly maps existing citizen to session | Citizen `john@example.com` exists with `BeneficiaryID = 1`. | 1. Login via OAuth as John Doe. 2. Send `GET /auth/me`. 3. Inspect response. | Response contains `{userId: 1, role: "citizen", name: "John Doe", email: "john@example.com"}`. The `userId` matches `BeneficiaryID` from the database. | |
| | | | | [INSERT SCREENSHOT: Postman /auth/me showing userId matching BeneficiaryID from database] | |

### 9.2.3 System Tests (Black-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| ENRL-ST-01 | Citizen Dashboard displays profile information | Citizen logged in via Google OAuth. Frontend running. | 1. Login as a registered citizen. 2. Navigate to the Citizen Dashboard. 3. Observe the profile section. | Dashboard displays the citizen's Name, Email, Income, and Category fetched from the backend. Data matches the database record. | |
| | | | | [INSERT SCREENSHOT: Citizen Dashboard UI showing profile details (Name, Email, Income, Category)] | |
| ENRL-ST-02 | New user sees default profile values after first login | Frontend + Backend running. Use a brand-new Google account. | 1. Clear cookies. 2. Login with a new Google account. 3. Navigate to Profile section on the Citizen Dashboard. | Profile shows: Name and Email from Google, Income = `0`, Category = `General`. This confirms auto-registration defaults are correctly reflected in the UI. | |
| | | | | [INSERT SCREENSHOT: New citizen's dashboard showing default Income=0 and Category=General] | |

---

<br>

> **— End of Part III-A —**
>
> Continue to `test_plan_3b.md` for Test Cases of Subsystems 3 & 4, and Section 10 (Testing Schedule).
