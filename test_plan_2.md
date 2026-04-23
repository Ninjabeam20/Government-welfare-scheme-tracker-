<div class="page-title">

# Government Welfare Eligibility & Tracking System
### Laboratory-10: Comprehensive Test Plan Document — Part II

<br>

**Sections Covered:** 4. Features to be Tested / Not to be Tested · 5. Pass/Fail Criteria · 6. Approach

</div>

<div style="page-break-after: always;"></div>

---

# 4. Features to be Tested / Not to be Tested

## 4.1 Features to be Tested

The following feature matrix enumerates every testable capability across the four targeted subsystems, categorized by testing level.

### 4.1.1 Subsystem 1 — Authentication & Access Control

| Feature ID | Feature Description | Testing Level | Technique |
|------------|-------------------|---------------|-----------|
| AUTH-F01 | Google OAuth 2.0 login initiation via `/auth/google` redirects to Google consent screen | System | Black-Box |
| AUTH-F02 | OAuth callback at `/auth/google/callback` correctly resolves user role (`admin`, `officer`, `citizen`) and redirects to the appropriate portal dashboard | System | Black-Box |
| AUTH-F03 | Session cookie is created upon successful authentication with 24-hour `maxAge` expiry | Integration | White-Box |
| AUTH-F04 | `/auth/me` endpoint returns authenticated user object `{userId, role, name, email}` when session is valid | Unit | White-Box |
| AUTH-F05 | `/auth/me` endpoint returns `401 Unauthorized` when no active session exists | Unit | White-Box |
| AUTH-F06 | `/auth/logout` destroys the session and returns `{success: true}` | Integration | White-Box |
| AUTH-F07 | RBAC enforcement: Citizen session cannot access `/api/officer/*` or `/api/admin/*` endpoints | Integration | White-Box |
| AUTH-F08 | RBAC enforcement: Officer session cannot access `/api/admin/*` endpoints | Integration | White-Box |
| AUTH-F09 | Passport.js `serializeUser` / `deserializeUser` correctly persists and restores user object across requests | Unit | White-Box |

### 4.1.2 Subsystem 2 — Citizen Enrollment & Profile Management

| Feature ID | Feature Description | Testing Level | Technique |
|------------|-------------------|---------------|-----------|
| ENRL-F01 | First-time Google OAuth login auto-registers citizen into `individualbeneficiaries` table with `Income = 0`, `Category = 'General'`, and `Aadhaar = NULL` | Integration | White-Box |
| ENRL-F02 | Auto-registration inserts correct `Name` and `Email` from Google profile into the database | Unit | White-Box |
| ENRL-F03 | Returning citizen login does NOT create a duplicate record; existing `BeneficiaryID` is returned | Integration | White-Box |
| ENRL-F04 | `GET /api/citizen/profile/:beneficiaryId` returns correct profile object `{BeneficiaryID, Name, Email, Income, Category}` | Unit | White-Box |
| ENRL-F05 | `GET /api/citizen/profile/:beneficiaryId` returns `404 Not Found` for non-existent `BeneficiaryID` | Unit | White-Box |
| ENRL-F06 | `Email` column `UNIQUE` constraint prevents duplicate email insertion at the database level | Unit | White-Box |
| ENRL-F07 | Citizen Dashboard UI renders profile data fetched from the backend without rendering errors | System | Black-Box |

### 4.1.3 Subsystem 3 — Scheme Discovery & Application Processing

| Feature ID | Feature Description | Testing Level | Technique |
|------------|-------------------|---------------|-----------|
| SCHM-F01 | `GET /api/citizen/schemes` returns only schemes where `isactive = 1` | Unit | White-Box |
| SCHM-F02 | Inactive schemes (`isactive = 0`) are excluded from the API response | Unit | White-Box |
| SCHM-F03 | Each scheme object contains `{SchemeID, SchemeName, Description, isactive, max_income}` | Unit | White-Box |
| SCHM-F04 | `POST /api/citizen/apply` with valid `{citizen_id, scheme_id}` creates a new row in `currentapplications` with `Status = 'Pending'` | Integration | White-Box |
| SCHM-F05 | `POST /api/citizen/apply` with invalid (non-existent) `scheme_id` returns a `500` error due to foreign key constraint violation | Unit | White-Box |
| SCHM-F06 | `Applied_on` timestamp is auto-populated via `DEFAULT CURRENT_TIMESTAMP` upon insertion | Unit | White-Box |
| SCHM-F07 | `GET /api/citizen/applications/:beneficiaryId` returns all applications for a given citizen, ordered by `Applied_on DESC` | Integration | White-Box |
| SCHM-F08 | `GET /api/citizen/track/:recordId` returns the specific application details including `SchemeName` and `Status` | Unit | White-Box |
| SCHM-F09 | `GET /api/citizen/track/:recordId` returns `404` for a non-existent `RecordID` | Unit | White-Box |
| SCHM-F10 | Citizen UI displays list of active schemes and allows submission via "Apply" button | System | Black-Box |
| SCHM-F11 | Citizen UI displays application history with status badges | System | Black-Box |

### 4.1.4 Subsystem 4 — Workflow Automation & Decision Management

| Feature ID | Feature Description | Testing Level | Technique |
|------------|-------------------|---------------|-----------|
| WKFL-F01 | `GET /api/officer/queue/:officerId` returns all applications where `Status = 'Pending'` with joined beneficiary and scheme details | Integration | White-Box |
| WKFL-F02 | `PUT /api/officer/applications/:id/approve` updates `Status` from `'Pending'` to `'Approved'` | Unit | White-Box |
| WKFL-F03 | `PUT /api/officer/applications/:id/reject` updates `Status` from `'Pending'` to `'Rejected'` | Unit | White-Box |
| WKFL-F04 | Approval action inserts an audit log entry `"Approved application #<ID>"` with `ActorType = 'Officer'` into `auditlogs` | Integration | White-Box |
| WKFL-F05 | Rejection action inserts an audit log entry `"Rejected application #<ID>"` with `ActorType = 'Officer'` into `auditlogs` | Integration | White-Box |
| WKFL-F06 | Officer Dashboard UI displays pending application queue with citizen Name, Aadhaar, Income, and SchemeName | System | Black-Box |
| WKFL-F07 | Officer clicks "Approve" → application disappears from queue → status reflected as "Approved" in Citizen portal | System | Black-Box |
| WKFL-F08 | Officer clicks "Reject" → application disappears from queue → status reflected as "Rejected" in Citizen portal | System | Black-Box |
| WKFL-F09 | Admin Dashboard audit log view (`GET /api/admin/auditlogs`) shows the officer's approval/rejection action with correct timestamp | System | Black-Box |

---

## 4.2 Features Not to be Tested

The following features are explicitly **excluded** from this test plan due to scope constraints, third-party dependency boundaries, or relevance to the targeted subsystems:

| Exclusion | Rationale |
|-----------|-----------|
| **Google OAuth Internal Mechanisms** | The cryptographic handshake, token exchange, and consent screen rendering are owned and maintained by Google's authorization servers. Testing their internal correctness falls outside the boundary of this system. We test only the *integration point* (callback handling). |
| **eKYC & Identity Verification Subsystem** | Document upload (`/api/citizen/documents/upload`), Aadhaar verification logic, and biometric validation are not among the four subsystems selected for this lab assignment. |
| **Admin CRUD Operations on Schemes** | While the admin routes (`POST/PUT/DELETE /api/admin/schemes`) exist, the focus of Subsystem 3 is on the *citizen-facing* discovery and application flow. Admin scheme management is tested only indirectly (schemes must exist for citizens to browse). |
| **Admin Officer Management** | Adding, suspending, or reactivating officers via `/api/admin/officers` is outside the targeted subsystem scope. |
| **Grievance Submission** | The `POST /api/citizen/grievance` endpoint is a standalone feature not mapped to any of the four tested subsystems. |
| **Browser Compatibility Testing** | Testing is conducted exclusively on Google Chrome (latest). Cross-browser compatibility with Firefox, Safari, or Edge is not validated. |
| **Performance / Load Testing** | Stress testing, concurrent user simulation, and response-time benchmarking are outside the scope of this functional test plan. |
| **Mobile Responsiveness** | CSS media query behavior and touch-gesture interactions on mobile viewports are not tested. |
| **Network Failure / Offline Scenarios** | Behavior under network disconnection, DNS failures, or backend server crashes is not evaluated. |

<div style="page-break-after: always;"></div>

---

# 5. Pass/Fail Criteria

## 5.1 Individual Test Case Criteria

Each test case is evaluated against its documented **Expected Result**. The determination is binary:

| Verdict | Condition |
|---------|-----------|
| **PASS** ✅ | The actual observed output/behavior matches the documented Expected Result **exactly**. For API tests, this means the correct HTTP status code, response body structure, and database state are all verified. For UI tests, the expected visual element is rendered and interactive. |
| **FAIL** ❌ | The actual observed output/behavior **deviates** from the Expected Result in any measurable dimension—incorrect status code, malformed response body, missing database row, UI rendering error, or unexpected exception. |

## 5.2 Subsystem-Level Criteria

A subsystem is considered to have passed testing if and only if **all** of the following conditions are satisfied:

| Criterion | Threshold | Description |
|-----------|-----------|-------------|
| **Critical Test Pass Rate** | 100% | All test cases tagged as critical (authentication, data integrity, state transitions) must pass without exception. |
| **Overall Test Pass Rate** | ≥ 90% | At least 90% of all test cases within the subsystem must pass. |
| **No Severity-1 Defects** | 0 defects | No defects that cause system crashes, data corruption, or security breaches are permitted. |
| **Data Integrity** | 100% | All database operations must maintain referential integrity; no orphaned records or constraint violations are acceptable. |

## 5.3 Overall Test Plan Criteria

The test plan as a whole is considered **successfully executed** when:

1. All four subsystems meet their individual pass criteria as defined in Section 5.2.
2. The end-to-end integration flow (Citizen registers → applies for scheme → Officer approves → status reflects in Citizen portal → audit log generated) completes without failure.
3. All screenshot evidence placeholders are fulfilled with captured artifacts demonstrating actual test execution.

## 5.4 Defect Severity Classification

| Severity | Definition | Example |
|----------|-----------|---------|
| **Severity 1 — Critical** | System crash, data loss, or security vulnerability. Testing must halt. | OAuth callback fails silently; SQL injection possible via un-parameterized query. |
| **Severity 2 — Major** | Core feature non-functional but system remains operational. | Application submission returns success but no row is inserted in `currentapplications`. |
| **Severity 3 — Minor** | Feature works but with cosmetic or non-critical deviations. | Timestamp format displays differently than expected in the UI. |
| **Severity 4 — Trivial** | Cosmetic issue with no functional impact. | Misaligned CSS padding on a dashboard card. |

<div style="page-break-after: always;"></div>

---

# 6. Approach

## 6.1 Testing Strategy Overview

The testing approach for this project employs a **hybrid methodology** combining both Black-Box and White-Box techniques, executed across three progressive testing levels: **Unit**, **Integration**, and **System**. This strategy ensures coverage from individual function correctness up through full end-to-end user workflow validation.

```
┌────────────────────────────────────────────────────────────┐
│                    SYSTEM TESTING                          │
│        (Black-Box: End-to-End User Workflows)              │
│   ┌────────────────────────────────────────────────────┐   │
│   │              INTEGRATION TESTING                    │   │
│   │    (White-Box: API ↔ Database ↔ Session)            │   │
│   │   ┌────────────────────────────────────────────┐    │   │
│   │   │            UNIT TESTING                     │    │   │
│   │   │  (White-Box: Individual Route Handlers,     │    │   │
│   │   │   SQL Queries, Middleware Functions)         │    │   │
│   │   └────────────────────────────────────────────┘    │   │
│   └────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

## 6.2 Testing Techniques

### 6.2.1 Black-Box Testing (Functional / Specification-Driven)

Black-Box testing treats the system as an opaque entity, validating **what** the system does without examining **how** it does it. The tester interacts exclusively through the user interface (browser) and observes outputs.

**Techniques Applied:**

| Technique | Application in This Project |
|-----------|-----------------------------|
| **Equivalence Partitioning** | Dividing input domains into valid and invalid classes. *Example:* For scheme application — valid class: existing `citizen_id` + active `scheme_id`; invalid class: non-existent `scheme_id`. |
| **Boundary Value Analysis** | Testing at the edges of input constraints. *Example:* Citizen `Income = 50000` (exactly at `max_income` boundary) vs. `Income = 50001` (exceeds threshold). |
| **State Transition Testing** | Validating the application status state machine: `Pending → Approved` and `Pending → Rejected` are valid transitions; `Approved → Pending` is invalid. |
| **Use Case Testing** | End-to-end scenario validation following real user workflows. *Example:* Complete citizen journey from login → browse schemes → apply → track status. |

**Tools:** Google Chrome Browser, React Development Server (`http://localhost:5173`).

### 6.2.2 White-Box Testing (Structural / Implementation-Driven)

White-Box testing examines the internal structure of the code, validating **how** the system processes requests, constructs SQL queries, and manages session state.

**Techniques Applied:**

| Technique | Application in This Project |
|-----------|-----------------------------|
| **Statement Coverage** | Ensuring every line in critical route handlers (`authRoutes.js`, `citizenRoutes.js`, `officerRoutes.js`) is exercised. *Example:* The `if (admins.length > 0)` branch in the OAuth callback is triggered by logging in with `admin@govt.in`. |
| **Decision/Branch Coverage** | Validating both `true` and `false` outcomes of conditional branches. *Example:* The `if (!req.user)` guard in `/auth/me` — tested with an active session (false branch) and without a session (true branch, returns 401). |
| **Path Coverage** | Tracing execution through the complete middleware pipeline: `CORS → Body Parser → Session → Passport → Route Handler → MySQL Query → Response`. |
| **Data Flow Testing** | Tracking variable definitions and uses. *Example:* `const email = profile.emails[0].value` is defined in the OAuth callback and subsequently used in `SELECT * FROM admins WHERE Email=?` — verifying the value flows correctly from Google profile to SQL query parameter. |

**Tools:** Postman (API testing), MySQL Workbench / CLI (database state verification), Backend server console logs.

## 6.3 Testing Levels

### 6.3.1 Unit Testing

| Aspect | Details |
|--------|---------|
| **Scope** | Individual route handler functions, SQL query correctness, middleware guard functions |
| **Method** | Direct API endpoint invocation via Postman with controlled input payloads |
| **Isolation** | Each test targets a single endpoint; database is reset to seed state before each test batch |
| **Verification** | HTTP response status code + response body JSON structure + MySQL table state |
| **Example** | `GET /api/citizen/schemes` — verify response is an array containing only rows where `isactive = 1` |

### 6.3.2 Integration Testing

| Aspect | Details |
|--------|---------|
| **Scope** | Interaction between two or more components: API ↔ Database, OAuth ↔ Session ↔ RBAC, Frontend ↔ API |
| **Method** | Sequential API calls simulating multi-step workflows; database state checked after each step |
| **Verification** | End-state correctness across multiple tables; session persistence across requests |
| **Example** | `POST /api/citizen/apply` → verify row exists in `currentapplications` → verify `GET /api/citizen/applications/:id` returns the new application |

### 6.3.3 System Testing

| Aspect | Details |
|--------|---------|
| **Scope** | Complete end-to-end user workflows through the browser UI |
| **Method** | Manual browser interaction following prescribed step-by-step procedures |
| **Verification** | Visual confirmation of UI elements, navigation flow correctness, data consistency between portals |
| **Example** | Citizen logs in → browses schemes → applies → Officer logs in → approves → Citizen sees "Approved" status |

## 6.4 Test Environment Configuration

| Component | Configuration |
|-----------|--------------|
| **Operating System** | macOS / Windows 10+ |
| **Browser** | Google Chrome (Latest Stable) |
| **Frontend Server** | `npm run dev` → `http://localhost:5173` |
| **Backend Server** | `node server.js` → `http://localhost:5000` |
| **Database** | MySQL 8.x, database: `welfare_system`, seeded via `seed-database.sql` |
| **API Testing Tool** | Postman (Latest) |
| **Database Client** | MySQL Workbench or MySQL CLI |

## 6.5 Test Data Management

All tests utilize the seed data provisioned by `seed-database.sql`:

| Entity | Seed Record | Key Fields |
|--------|------------|------------|
| Admin | `System Admin` | Email: `admin@govt.in`, Password: `password123` |
| Officer | `Aarti Sharma` | Email: `aarti@govt.in`, Department: `Healthcare` |
| Citizen | `John Doe` | Email: `john@example.com`, Aadhaar: `123456789012`, Income: `45000`, Category: `General` |
| Scheme (Active) | `National Health Grant` | `isactive = 1`, `max_income = 50000` |
| Scheme (Inactive) | `Education Scholarship` | `isactive = 0`, `max_income = 100000` |

> **[!IMPORTANT]**
> Before executing each test batch, the database must be reset to its seed state by re-running `seed-database.sql` to ensure deterministic, reproducible test results.

## 6.6 Test Execution Methodology

All test cases in this plan are designed for **manual execution**. The prescribed workflow for each test is:

1. **Pre-condition Setup** — Verify the test environment matches the stated pre-conditions (servers running, database seeded).
2. **Step Execution** — Follow the documented test steps sequentially, performing each action exactly as described.
3. **Observation** — Compare the actual result against the documented Expected Result.
4. **Evidence Capture** — At each `[INSERT SCREENSHOT: ...]` placeholder, capture a screenshot of the specified element.
5. **Verdict Recording** — Mark the test case as **PASS** or **FAIL** in the results column.

---

<br>

> **— End of Part II —**
>
> Continue to `test_plan_3.md` for Sections 7 (Suspension & Resumption), 8 (Testing Materials), 9 (Test Cases — Detailed Tables), and 10 (Testing Schedule).
