# Government Welfare Eligibility & Tracking System

## Laboratory-10: Test Plan

<br>

| Field | Details |
|-------|---------|
| **Prepared By** | [Your Name / Roll Number] |
| **Course / Program** | [Your Course Name] |
| **Institution** | [Your College / University Name] |
| **Date** | [DD Month YYYY] |
| **Document Version** | 1.0 |
| **Reference Standard** | IEEE 829-2008 · 11.5.1 Planning Testing |

<br>

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Relationship to Other Documents](#2-relationship-to-other-documents)
3. [System Overview](#3-system-overview)
4. [Features to be Tested / Not to be Tested](#4-features-to-be-tested--not-to-be-tested)
5. [Pass/Fail Criteria](#5-passfail-criteria)
6. [Approach](#6-approach)
7. [Suspension and Resumption Criteria](#7-suspension-and-resumption-criteria)
8. [Testing Materials (Hardware/Software Requirements)](#8-testing-materials-hardwaresoftware-requirements)
9. [Test Cases](#9-test-cases)
10. [Testing Schedule](#10-testing-schedule)

---

<div style="page-break-after: always;"></div>

# 1. Introduction

## 1.1 Purpose

The purpose of this Test Plan is to define a structured, repeatable, and academically rigorous testing strategy for the **Government Welfare Eligibility & Tracking System**. This document prescribes the complete verification and validation methodology—encompassing **Unit Testing**, **Integration Testing**, and **System Testing**—to be executed across four critical subsystems of the application architecture.

The test plan employs both **Black-Box** (functional, specification-driven) and **White-Box** (structural, implementation-driven) testing techniques to ensure exhaustive coverage of the system's behavioral and architectural correctness. The overarching objective is to guarantee that the Tri-Portal ecosystem (Citizen Portal, Officer Portal, Administrative Dashboard) satisfies all functional requirements, enforces strict Role-Based Access Control (RBAC) policies, maintains referential integrity across the MySQL persistence layer, and upholds the deterministic state-transition logic governing application lifecycle workflows.

## 1.2 Scope of Testing

This test plan targets the following four subsystems, selected for their criticality within the system's operational taxonomy:

| # | Subsystem | Scope of Testing |
|---|-----------|------------------|
| 1 | **Authentication & Access Control** | Google OAuth 2.0 login/logout flow, session management via `express-session`, RBAC middleware enforcement across `admin`, `officer`, and `citizen` route namespaces. |
| 2 | **Citizen Enrollment & Profile Management** | Citizen auto-registration during first OAuth login, profile data retrieval via `/api/citizen/profile/:id`, demographic attribute persistence in the `individualbeneficiaries` table. |
| 3 | **Scheme Discovery & Application Processing** | Retrieval of active welfare schemes (`isactive = 1`), application submission via `/api/citizen/apply`, eligibility boundary validation against `max_income`, and application tracking via `RecordID`. |
| 4 | **Workflow Automation & Decision Management** | Officer queue retrieval of pending applications, approval/rejection state transitions on `currentapplications.Status`, and immutable audit log generation in the `auditlogs` table. |

## 1.3 Objectives

The specific testing objectives are formulated as follows:

1. **Functional Correctness:** Validate that every API endpoint and UI interaction produces deterministic, specification-compliant outputs for all valid and invalid input vectors.
2. **Security Enforcement:** Confirm that the RBAC middleware pipeline rejects unauthorized cross-role access attempts with appropriate HTTP `401 Unauthorized` responses.
3. **Data Integrity:** Verify that all `INSERT`, `UPDATE`, and `SELECT` operations against the MySQL `welfare_system` database maintain strict referential integrity via enforced `FOREIGN KEY` constraints.
4. **State Machine Compliance:** Ensure that the application status field transitions strictly within the defined state set `{Pending, Approved, Rejected}` and that each transition is atomically logged in the `auditlogs` table.
5. **Regression Safety:** Establish a baseline suite of test cases that can be re-executed after future code modifications to detect unintended behavioral regressions.

## 1.4 Intended Audience

This document is intended for:

- **Course Instructor / Lab Evaluator** — For academic assessment of testing methodology and coverage.
- **Development Team Members** — For executing the prescribed test procedures and recording empirical evidence.
- **Quality Assurance Reviewers** — For evaluating the completeness and traceability of the test design against defined requirements.

<div style="page-break-after: always;"></div>

---

# 2. Relationship to Other Documents

This Test Plan does not exist in isolation; it derives its requirements, architectural context, and validation criteria from a constellation of interrelated project artifacts. The following table establishes the formal traceability matrix between this document and its source references.

| Document | Relationship | Description |
|----------|-------------|-------------|
| **Project Report** (`Project_Report.md`) | Primary Reference | Provides the complete architectural specification of the Tri-Portal system, including the Three-Tier Network Logical Model (Presentation → Business Logic → Persistence), the MERN-variant technology stack, RBAC policy definitions, and the database schema design employing Third Normal Form (3NF) normalization. All test cases in this plan are derived from functional requirements articulated therein. |
| **Database Schema** (`DB_SCHEMA.md`) | Data Layer Reference | Defines the exact table structures (`admins`, `officers`, `individualbeneficiaries`, `welfareschemes`, `currentapplications`, `auditlogs`), column data types, `UNIQUE` index constraints, `FOREIGN KEY` referential integrity rules, and seed data. White-Box test cases directly reference these constraints for validation. |
| **Seed Database Script** (`seed-database.sql`) | Test Data Reference | Contains the SQL initialization script that provisions the `welfare_system` database with baseline test data, including a default Admin (`admin@govt.in`), Officer (`aarti@govt.in`), Citizen (`john@example.com`), and sample welfare schemes. This seed data forms the prerequisite state for all test case execution. |
| **Implementation Plan** (`ImplementationPlan.md`) | Test Strategy Reference | Outlines the strategic testing approach, subsystem selection rationale, test case design methodology, and the screenshot placeholder strategy adopted in this plan. |
| **Backend Source Code** (`backend/server.js`, `backend/routes/*.js`) | Implementation Reference | The actual Express.js route handlers, Passport.js Google OAuth strategy, and MySQL parameterized query logic against which White-Box test cases are structurally designed and verified. |
| **Frontend Source Code** (`frontend/src/pages/*`) | UI Reference | The React.js component hierarchy and client-side routing logic (`react-router-dom`) against which Black-Box system-level test cases validate user-facing workflows and visual outputs. |

### 2.1 Applicable Standards and References

| Standard | Applicability |
|----------|--------------|
| **IEEE 829-2008** | Standard for Software and System Test Documentation — informs the structural organization of this plan. |
| **IEEE 730-2014** | Software Quality Assurance Processes — guides the quality criteria definitions in Section 5. |
| **ISTQB Foundation Level Syllabus** | Provides the theoretical framework for Black-Box (Equivalence Partitioning, Boundary Value Analysis) and White-Box (Statement Coverage, Branch Coverage) techniques used in Section 6. |
| **RFC 6749** | The OAuth 2.0 Authorization Framework — referenced for authentication flow validation in Subsystem 1. |

<div style="page-break-after: always;"></div>

---

# 3. System Overview

## 3.1 System Architecture

The **Government Welfare Eligibility & Tracking System** is architected as a decoupled, full-stack web application adhering to a strict **Three-Tier Logical Architecture**, traversing distinct security and functional zones:

```
┌──────────────────────────────────────────────────────────────────────┐
│                      TIER 1: PRESENTATION LAYER                      │
│            React.js SPA  ·  Vite ES-Module Bundler  ·  Port 5173     │
│                                                                      │
│    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐    │
│    │  Citizen Portal │  │ Officer Portal  │  │ Admin Dashboard │    │
│    │  /citizen/*     │  │ /officer/*      │  │ /admin/*        │    │
│    └────────┬────────┘  └────────┬────────┘  └────────┬────────┘    │
│             └───────────────────┬┴────────────────────┘              │
│                           Axios HTTP/REST                            │
├───────────────────────────────── ┼ ──────────────────────────────────┤
│                      TIER 2: APPLICATION LAYER                       │
│           Node.js + Express.js API Server  ·  Port 5000              │
│                                                                      │
│  ┌────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐    │
│  │ authRoutes │ │citizenRoutes│ │officerRoutes│ │ adminRoutes │    │
│  └──────┬─────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘    │
│         └──────────────┴───────────────┴───────────────┘            │
│    CORS Policy → Body Parser → express-session → Passport.js         │
├───────────────────────────────── ┼ ──────────────────────────────────┤
│                      TIER 3: PERSISTENCE LAYER                       │
│           MySQL 8.x  ·  InnoDB Engine  ·  welfare_system DB          │
│                                                                      │
│    admins  │  officers  │  individualbeneficiaries                   │
│    welfareschemes  │  currentapplications  │  auditlogs              │
└──────────────────────────────────────────────────────────────────────┘
```

## 3.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React.js | 18.x | Single-Page Application with declarative UI rendering via Virtual DOM |
| Bundler | Vite | 7+ | Native ES-Module development server with Hot Module Replacement (HMR) |
| Client Routing | React Router DOM | 6.x | Client-side SPA routing without full-page reloads |
| HTTP Client | Axios | Latest | Promise-based HTTP client with interceptor support for API communication |
| Backend Runtime | Node.js | 18+ | Asynchronous, non-blocking event-loop server environment |
| Web Framework | Express.js | 4.x | Minimalist middleware-driven HTTP request/response pipeline |
| Authentication | Passport.js + Google OAuth 2.0 | Latest | Delegated identity verification via Google's authorization servers |
| Session Management | express-session | Latest | Server-side session persistence with configurable cookie lifetime |
| Database | MySQL | 8.x | ACID-compliant relational database with InnoDB storage engine |
| DB Driver | mysql2/promise | Latest | Async/await-compatible MySQL driver with connection pooling (`connectionLimit: 10`) |
| File Handling | Multer | Latest | Multipart form-data middleware for binary document uploads |
| Secrets Management | dotenv | Latest | Environment variable injection; keeps credentials out of version control |

## 3.3 Database Schema — Entity Relationship Summary

The `welfare_system` database comprises **six** interrelated tables enforcing strict referential integrity via InnoDB foreign keys:

```
admins                         officers
┌────────────────────┐         ┌────────────────────────┐
│ AdminID  (PK)      │         │ OfficerID  (PK)        │
│ Name               │         │ Name                   │
│ Email      (UNIQUE)│         │ Email          (UNIQUE)│
│ Password           │         │ Department             │
└────────────────────┘         │ Status                 │
                               └──────────┬─────────────┘
                                          │ FK: OfficerID
individualbeneficiaries                   │
┌────────────────────┐    currentapplications
│ BeneficiaryID (PK) │──┐  ┌──────────────────────────┐
│ Name               │  └─►│ RecordID       (PK)      │
│ Email      (UNIQUE)│     │ BeneficiaryID  (FK)      │
│ Aadhaar    (UNIQUE)│     │ SchemeID       (FK)      │
│ Income             │     │ OfficerID      (FK)      │
│ Category           │     │ Applied_on  (TIMESTAMP)  │
└────────────────────┘     │ Status      (VARCHAR 30) │
                           └──────────────────────────┘
welfareschemes                             │
┌────────────────────┐                     │
│ SchemeID   (PK)    │◄────────────────────┘ FK: SchemeID
│ SchemeName (UNIQUE)│
│ Description        │      auditlogs (standalone, no FK)
│ isactive (TINYINT) │      ┌──────────────────────────┐
│ max_income (INT)   │      │ LogID        (PK)        │
└────────────────────┘      │ ActorType    (VARCHAR)   │
                            │ ActionDetails (TEXT)     │
                            │ ActionTime   (DATETIME)  │
                            └──────────────────────────┘
```

**Key Schema Constraints:**

| Constraint | Table | Column | Effect |
|------------|-------|--------|--------|
| `PRIMARY KEY` AUTO_INCREMENT | All tables | `*ID` fields | Unique row identification |
| `UNIQUE` | `individualbeneficiaries` | `Email`, `Aadhaar` | Prevents duplicate citizen enrollment |
| `UNIQUE` | `admins`, `officers` | `Email` | Prevents duplicate admin/officer accounts |
| `FOREIGN KEY` | `currentapplications` | `BeneficiaryID`, `SchemeID`, `OfficerID` | Referential integrity — orphaned records rejected |
| `DEFAULT CURRENT_TIMESTAMP` | `currentapplications` | `Applied_on` | Auto-populates submission time |
| `DEFAULT 'Pending'` | `currentapplications` | `Status` | All new applications begin in Pending state |

## 3.4 Subsystem Decomposition

The system is logically decomposed into five subsystems; **four** are targeted for testing in this plan:

| Subsystem | Key Source Files | Core Responsibility | In Scope |
|-----------|----------------|--------------------|---------:|
| **Authentication & Access Control** | `authRoutes.js`, `server.js` (Passport Strategy), `express-session` | Handles Google OAuth 2.0 login/logout, session cookie lifecycle, and RBAC enforcement across route namespaces | ✅ Yes |
| **Citizen Enrollment & Profile Management** | `citizenRoutes.js` (`/profile`), `server.js` (OAuth callback auto-registration) | Manages citizen auto-registration on first login, profile data retrieval, and demographic persistence | ✅ Yes |
| **Scheme Discovery & Application Processing** | `citizenRoutes.js` (`/schemes`, `/apply`, `/track`, `/applications`) | Retrieves active welfare schemes, processes application submissions with FK enforcement, provides status tracking | ✅ Yes |
| **Workflow Automation & Decision Management** | `officerRoutes.js` (`/queue`, `/approve`, `/reject`), `auditlogs` table | Officer queue management, approval/rejection state transitions, and immutable audit log generation | ✅ Yes |
| eKYC & Identity Verification | `citizenRoutes.js` (`/documents`) | Document upload (Multer), file serving, document status management | ❌ Out of Scope |

## 3.5 Application Status State Machine

The `currentapplications.Status` field implements a deterministic finite state machine. Valid state transitions are:

```
                     ┌──────────────────┐
   Application  ───► │     Pending      │  (Default on INSERT)
   Submitted         └────────┬─────────┘
                              │
                     Officer reviews via
                     /api/officer/applications/:id
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
    ┌───────────────────┐        ┌────────────────────┐
    │     Approved      │        │      Rejected      │
    │  (PUT .../approve)│        │  (PUT .../reject)  │
    └───────────────────┘        └────────────────────┘
```

> **Invariant:** Every state transition (`Pending → Approved` or `Pending → Rejected`) atomically triggers an `INSERT` into the `auditlogs` table with `ActorType = 'Officer'` and the corresponding `ActionDetails`. This is verified in Subsystem 4 test cases.

---

<div style="page-break-after: always;"></div>

# 4. Features to be Tested / Not to be Tested

## 4.1 Features to be Tested

### 4.1.1 Subsystem 1 — Authentication & Access Control

| Feature ID | Feature Description | Level | Technique |
|------------|-------------------|-------|-----------|
| AUTH-F01 | Google OAuth 2.0 login via `/auth/google` redirects to Google consent screen | System | Black-Box |
| AUTH-F02 | OAuth callback resolves role (`admin`/`officer`/`citizen`) and redirects to correct portal | System | Black-Box |
| AUTH-F03 | Session cookie created on successful auth with 24-hour `maxAge` | Integration | White-Box |
| AUTH-F04 | `/auth/me` returns `{userId, role, name, email}` when session is valid | Unit | White-Box |
| AUTH-F05 | `/auth/me` returns `401 Unauthorized` when no session exists | Unit | White-Box |
| AUTH-F06 | `/auth/logout` destroys session and returns `{success: true}` | Integration | White-Box |
| AUTH-F07 | RBAC: Citizen session cannot access `/api/officer/*` or `/api/admin/*` | Integration | White-Box |
| AUTH-F08 | RBAC: Officer session cannot access `/api/admin/*` endpoints | Integration | White-Box |
| AUTH-F09 | `serializeUser`/`deserializeUser` correctly persists and restores user object | Unit | White-Box |

### 4.1.2 Subsystem 2 — Citizen Enrollment & Profile Management

| Feature ID | Feature Description | Level | Technique |
|------------|-------------------|-------|-----------|
| ENRL-F01 | First-time OAuth login auto-registers citizen with `Income=0`, `Category='General'`, `Aadhaar=NULL` | Integration | White-Box |
| ENRL-F02 | Auto-registration stores correct `Name` and `Email` from Google profile | Unit | White-Box |
| ENRL-F03 | Returning citizen login does NOT create a duplicate record | Integration | White-Box |
| ENRL-F04 | `GET /api/citizen/profile/:id` returns correct profile object | Unit | White-Box |
| ENRL-F05 | `GET /api/citizen/profile/:id` returns `404` for non-existent ID | Unit | White-Box |
| ENRL-F06 | `Email` `UNIQUE` constraint rejects duplicate at database level | Unit | White-Box |
| ENRL-F07 | Citizen Dashboard renders profile data from backend without errors | System | Black-Box |

### 4.1.3 Subsystem 3 — Scheme Discovery & Application Processing

| Feature ID | Feature Description | Level | Technique |
|------------|-------------------|-------|-----------|
| SCHM-F01 | `GET /api/citizen/schemes` returns only schemes where `isactive = 1` | Unit | White-Box |
| SCHM-F02 | Inactive schemes (`isactive = 0`) are excluded from API response | Unit | White-Box |
| SCHM-F03 | Each scheme object contains `{SchemeID, SchemeName, Description, isactive, max_income}` | Unit | White-Box |
| SCHM-F04 | `POST /api/citizen/apply` creates row in `currentapplications` with `Status='Pending'` | Integration | White-Box |
| SCHM-F05 | `POST /api/citizen/apply` with non-existent `scheme_id` returns `500` due to FK violation | Unit | White-Box |
| SCHM-F06 | `Applied_on` auto-populated via `DEFAULT CURRENT_TIMESTAMP` | Unit | White-Box |
| SCHM-F07 | `GET /api/citizen/applications/:id` returns all citizen applications ordered `DESC` | Integration | White-Box |
| SCHM-F08 | `GET /api/citizen/track/:recordId` returns application details with joined `SchemeName` | Unit | White-Box |
| SCHM-F09 | `GET /api/citizen/track/:recordId` returns `404` for non-existent `RecordID` | Unit | White-Box |
| SCHM-F10 | Citizen UI displays active scheme list and allows Apply submission | System | Black-Box |
| SCHM-F11 | Citizen UI displays application history with current status | System | Black-Box |

### 4.1.4 Subsystem 4 — Workflow Automation & Decision Management

| Feature ID | Feature Description | Level | Technique |
|------------|-------------------|-------|-----------|
| WKFL-F01 | `GET /api/officer/queue/:id` returns all `Status='Pending'` applications with joined data | Integration | White-Box |
| WKFL-F02 | `PUT /api/officer/applications/:id/approve` updates `Status` to `'Approved'` | Unit | White-Box |
| WKFL-F03 | `PUT /api/officer/applications/:id/reject` updates `Status` to `'Rejected'` | Unit | White-Box |
| WKFL-F04 | Approve action inserts audit log entry with `ActorType='Officer'` | Integration | White-Box |
| WKFL-F05 | Reject action inserts audit log entry with `ActorType='Officer'` | Integration | White-Box |
| WKFL-F06 | Officer Dashboard displays pending queue with citizen and scheme details | System | Black-Box |
| WKFL-F07 | Officer Approve → application leaves queue → Citizen sees `'Approved'` | System | Black-Box |
| WKFL-F08 | Officer Reject → application leaves queue → Citizen sees `'Rejected'` | System | Black-Box |
| WKFL-F09 | Admin audit log view shows all officer decisions with timestamps | System | Black-Box |

---

## 4.2 Features Not to be Tested

| Feature | Rationale |
|---------|-----------|
| Google OAuth internal mechanisms | Owned by Google; only the callback integration point is tested |
| eKYC & Document Upload (`/api/citizen/documents`) | Outside the four targeted subsystems |
| Admin scheme CRUD (`POST/PUT/DELETE /api/admin/schemes`) | Out of scope; schemes are pre-seeded |
| Admin officer management (`/api/admin/officers`) | Not among the four selected subsystems |
| Citizen grievance submission (`POST /api/citizen/grievance`) | Standalone feature, not mapped to tested subsystems |
| Cross-browser compatibility | Testing conducted on Google Chrome only |
| Performance / load testing | Outside this functional test plan's scope |
| Mobile responsiveness | CSS media query behavior not evaluated |

<div style="page-break-after: always;"></div>

---

# 5. Pass/Fail Criteria

## 5.1 Individual Test Case Criteria

| Verdict | Condition |
|---------|-----------|
| **PASS ✅** | Actual output exactly matches the documented Expected Result — correct HTTP status code, response body structure, and database state all verified. |
| **FAIL ❌** | Actual output deviates from Expected Result in any dimension — wrong status code, malformed body, missing database row, UI error, or unexpected exception. |

## 5.2 Subsystem-Level Pass Criteria

A subsystem is considered passed when **all** of the following conditions are met:

| Criterion | Threshold |
|-----------|-----------|
| Critical test pass rate | 100% — all auth, data integrity, and state-transition tests must pass |
| Overall test pass rate | ≥ 90% of all tests within the subsystem |
| Severity-1 defects open | 0 — no crashes, data corruption, or security breaches permitted |
| Database integrity | 100% — no orphaned records or FK constraint violations |

## 5.3 Overall Plan Pass Criteria

The test plan is considered **successfully executed** when:

1. All four subsystems meet the criteria defined in Section 5.2.
2. The end-to-end flow completes without failure: Citizen registers → applies → Officer approves → status reflects in Citizen portal → audit log generated.
3. All `[INSERT SCREENSHOT]` placeholders are fulfilled with captured evidence.

## 5.4 Defect Severity Classification

| Severity | Definition | Example |
|----------|-----------|---------|
| **1 — Critical** | System crash, data loss, or security vulnerability. Testing halts immediately. | OAuth callback fails; SQL injection possible via un-parameterized query. |
| **2 — Major** | Core feature non-functional; system remains operational. | Application submission returns success but no DB row is created. |
| **3 — Minor** | Feature works with non-critical deviations. | Timestamp format differs from expected in the UI. |
| **4 — Trivial** | Cosmetic issue with no functional impact. | Misaligned padding on a dashboard card. |

<div style="page-break-after: always;"></div>

---

# 6. Approach

## 6.1 Strategy Overview

The testing approach combines **Black-Box** and **White-Box** techniques across three progressive levels:

```
┌────────────────────────────────────────────────────┐
│              SYSTEM TESTING (Black-Box)             │
│         End-to-end browser-based workflows          │
│  ┌──────────────────────────────────────────────┐  │
│  │        INTEGRATION TESTING (White-Box)        │  │
│  │     API ↔ Database ↔ Session interactions     │  │
│  │  ┌────────────────────────────────────────┐   │  │
│  │  │       UNIT TESTING (White-Box)          │   │  │
│  │  │  Individual route handlers, SQL queries │   │  │
│  │  └────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

## 6.2 Black-Box Techniques

| Technique | Application |
|-----------|------------|
| **Equivalence Partitioning** | Divides inputs into valid/invalid classes. *Example:* Valid = existing `citizen_id` + active `scheme_id`; Invalid = non-existent `scheme_id`. |
| **Boundary Value Analysis** | Tests at constraint edges. *Example:* `Income = 50000` (at `max_income` limit) vs `Income = 50001` (exceeds limit). |
| **State Transition Testing** | Validates FSM: `Pending → Approved` and `Pending → Rejected` are valid; reverse transitions are invalid. |
| **Use Case Testing** | Full scenario walkthroughs. *Example:* Login → Browse Schemes → Apply → Track Status. |

**Tools:** Google Chrome, React dev server (`http://localhost:5173`).

## 6.3 White-Box Techniques

| Technique | Application |
|-----------|------------|
| **Statement Coverage** | Every line in route handlers is exercised. *Example:* `if (admins.length > 0)` branch triggered by `admin@govt.in` login. |
| **Branch Coverage** | Both true/false outcomes of conditionals. *Example:* `if (!req.user)` in `/auth/me` — tested with and without an active session. |
| **Path Coverage** | Full middleware pipeline traced: CORS → Body Parser → Session → Passport → Route Handler → MySQL → Response. |
| **Data Flow Testing** | Variable traces from definition to use. *Example:* `email = profile.emails[0].value` flows correctly into `SELECT * FROM admins WHERE Email=?`. |

**Tools:** Postman (API testing), MySQL Workbench (database verification).

## 6.4 Testing Levels

| Level | Scope | Method | Verification |
|-------|-------|--------|-------------|
| **Unit** | Individual route handlers, SQL queries, middleware guards | Direct Postman API calls with controlled payloads | HTTP status + response body + DB state |
| **Integration** | API ↔ Database, OAuth ↔ Session ↔ RBAC, Frontend ↔ API | Sequential API calls; DB state checked at each step | Cross-table end-state correctness |
| **System** | Complete end-to-end user workflows through browser UI | Manual browser interaction following prescribed steps | Visual confirmation + data consistency across portals |

## 6.5 Test Environment

| Component | Configuration |
|-----------|--------------|
| OS | macOS / Windows 10+ |
| Browser | Google Chrome (Latest Stable) |
| Frontend | `npm run dev` → `http://localhost:5173` |
| Backend | `node server.js` → `http://localhost:5000` |
| Database | MySQL 8.x, `welfare_system` DB, seeded via `seed-database.sql` |
| API Tool | Postman (Latest) |
| DB Client | MySQL Workbench or MySQL CLI |

## 6.6 Seed Test Data

| Entity | Record | Key Fields |
|--------|--------|------------|
| Admin | System Admin | `admin@govt.in` |
| Officer | Aarti Sharma | `aarti@govt.in`, Dept: Healthcare |
| Citizen | John Doe | `john@example.com`, Aadhaar: `123456789012`, Income: `45000` |
| Scheme (Active) | National Health Grant | `isactive=1`, `max_income=50000` |
| Scheme (Inactive) | Education Scholarship | `isactive=0`, `max_income=100000` |

> **Important:** Re-run `seed-database.sql` before each test batch to restore a deterministic baseline state.

## 6.7 Execution Methodology

For each test case:
1. **Setup** — Verify pre-conditions (servers running, DB seeded, browser cookies cleared).
2. **Execute** — Follow documented steps sequentially and exactly as written.
3. **Observe** — Compare actual result against Expected Result.
4. **Capture** — Screenshot at every `[INSERT SCREENSHOT: …]` placeholder.
5. **Record** — Mark PASS or FAIL in the results column.

---

<div style="page-break-after: always;"></div>

# 7. Suspension and Resumption Criteria

## 7.1 Suspension Criteria

Testing shall be **immediately suspended** upon any of the following:

| ID | Condition | Severity | Action |
|----|-----------|----------|--------|
| SC-01 | Backend server at `http://localhost:5000` becomes unresponsive | Critical | Restart via `node server.js`; verify DB connectivity |
| SC-02 | MySQL `welfare_system` DB unreachable or connection pool exhausted | Critical | Restart MySQL daemon; verify via `/api/health`; re-seed if needed |
| SC-03 | Google OAuth service outage | Major | Monitor Google Cloud Status; defer Auth tests; continue non-auth tests |
| SC-04 | Seed data corrupted — DB deviates from expected baseline | Major | Re-execute `seed-database.sql` |
| SC-05 | Severity-1 defect discovered (crash, data loss, security breach) | Critical | Log defect with reproduction steps; halt all testing until resolved |
| SC-06 | Vite dev server fails to compile | Major | Fix compilation errors; restart with `npm run dev`; API tests may continue |

## 7.2 Resumption Criteria

Testing resumes only when **all** of the following are confirmed:

1. Frontend (`http://localhost:5173`) and backend (`http://localhost:5000`) are operational.
2. `GET /api/health` returns `{"status":"success","message":"Backend running"}`.
3. Database re-seeded and all 6 tables verified.
4. Any Severity-1 defects resolved and verified.
5. All browser sessions and cookies cleared.

---

<div style="page-break-after: always;"></div>

# 8. Testing Materials (Hardware/Software Requirements)

## 8.1 Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Processor | Intel Core i3 / Apple M1 | Intel Core i5+ / Apple M1 Pro+ |
| RAM | 4 GB | 8 GB+ |
| Storage | 500 MB free | 1 GB+ free |
| Network | Localhost loopback | Active internet (for Google OAuth) |
| Display | 1280×720 | 1920×1080 |

## 8.2 Software Requirements

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | 18.x+ | Backend runtime |
| npm | 9.x+ | Package manager |
| MySQL Server | 8.x | Database |
| MySQL Workbench (or CLI) | Latest | DB inspection and query execution |
| Google Chrome | Latest Stable | Black-Box system testing |
| Postman | Latest | White-Box API testing |

## 8.3 Environment Setup Commands

```bash
# 1. Seed the database
mysql -u root -p < seed-database.sql

# 2. Start backend
cd backend && node server.js
# Expected: "Database connected" + "Unified Server running on http://localhost:5000"

# 3. Start frontend
cd frontend && npm run dev
# Expected: "Local: http://localhost:5173"

# 4. Verify health
curl http://localhost:5000/api/health
# Expected: {"status":"success","message":"Backend running"}
```

---

<div style="page-break-after: always;"></div>

# 9. Test Cases

> **Notation:** Each table row is one test case. Screenshot placeholders appear in **bold** below the relevant row and must be fulfilled with captured evidence during execution.

---

## 9.1 Subsystem 1: Authentication & Access Control

### Unit Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| AUTH-UT-01 | `/auth/me` returns user object for authenticated session | Backend running; valid session exists | 1. Open Postman. 2. `GET http://localhost:5000/auth/me` with session cookie. 3. Inspect response. | `200 OK`; body: `{userId, role, name, email}` matching logged-in user. | |
| AUTH-UT-02 | `/auth/me` returns 401 for unauthenticated request | Backend running; no cookies | 1. New Postman session (no cookies). 2. `GET http://localhost:5000/auth/me`. | `401 Unauthorized`; body: `{"message":"Not logged in"}`. | |
| AUTH-UT-03 | `/auth/logout` destroys session | User authenticated | 1. `GET /auth/logout` with session cookie. 2. Inspect response. 3. `GET /auth/me` again. | Logout: `200 OK`, `{"success":true}`. Subsequent `/auth/me`: `401`. | |
| AUTH-UT-04 | `serializeUser` persists full user object | Backend running | 1. Review `server.js` lines 74-75. 2. Confirm full object passed to `done()`. | Entire `{userId, role, name, email}` is serialized into the session — not just an ID. | |

**[INSERT SCREENSHOT: Postman showing 200 OK from /auth/me with user object containing userId, role, name, email]**

**[INSERT SCREENSHOT: Postman showing 401 Unauthorized from /auth/me with no session cookie]**

**[INSERT SCREENSHOT: Postman showing logout 200 success followed by 401 on subsequent /auth/me]**

**[INSERT SCREENSHOT: server.js code showing serializeUser and deserializeUser functions]**

### Integration Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| AUTH-IT-01 | OAuth resolves Admin role and redirects to `/admin/dashboard` | `admin@govt.in` exists in `admins` table | 1. Navigate to `http://localhost:5000/auth/google`. 2. Authenticate with `admin@govt.in` Google account. 3. Observe redirect URL. | Redirects to `http://localhost:5173/admin/dashboard`. Session `role = 'admin'`. | |
| AUTH-IT-02 | OAuth resolves Officer role and redirects to `/officer/dashboard` | `aarti@govt.in` exists in `officers` table | 1. Navigate to `http://localhost:5000/auth/google`. 2. Authenticate with officer's Google account. | Redirects to `http://localhost:5173/officer/dashboard`. | |
| AUTH-IT-03 | OAuth resolves Citizen role and redirects to `/citizen/dashboard` | `john@example.com` exists in `individualbeneficiaries` | 1. Navigate to `http://localhost:5000/auth/google`. 2. Authenticate with citizen's Google account. | Redirects to `http://localhost:5173/citizen/dashboard`. | |
| AUTH-IT-04 | Session cookie persists across requests | User authenticated | 1. `GET /auth/me` — note `userId`. 2. Wait 5 seconds. 3. `GET /auth/me` again. | Both calls return identical user objects. Cookie `maxAge` is 24 hours. | |
| AUTH-IT-05 | RBAC: Citizen cannot access officer endpoint | Citizen session active | 1. Login as Citizen. 2. `GET http://localhost:5000/api/officer/queue/1` with citizen cookie. 3. Inspect response. | Response does not return officer-privileged data. Access is restricted or unauthorized. | |

**[INSERT SCREENSHOT: Browser URL bar showing /admin/dashboard immediately after OAuth login with admin account]**

**[INSERT SCREENSHOT: Browser URL bar showing /officer/dashboard after officer OAuth login]**

**[INSERT SCREENSHOT: Browser URL bar showing /citizen/dashboard after citizen OAuth login]**

**[INSERT SCREENSHOT: Postman showing citizen session blocked from /api/officer/queue/1]**

### System Tests (Black-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| AUTH-ST-01 | End-to-end Google OAuth login for Citizen | Frontend + Backend running; browser cookies cleared | 1. Open `http://localhost:5173`. 2. Click "Login with Google". 3. Select registered Google account. 4. Wait for redirect. | Google consent screen appears. After auth, user lands on Citizen Dashboard with their name displayed. | |
| AUTH-ST-02 | End-to-end logout flow | User logged into dashboard | 1. Click "Logout" button. 2. Observe redirect. 3. Attempt to navigate back to dashboard URL. | Redirected to login page. Direct dashboard URL access denied. | |
| AUTH-ST-03 | First-time user auto-registration via OAuth | Backend + DB running; new Google account not in any table | 1. Clear cookies. 2. Login with a brand-new Google account. 3. Verify redirect to Citizen Dashboard. 4. Check `individualbeneficiaries` in MySQL. | Dashboard loads. New row in `individualbeneficiaries`: correct Name and Email, `Aadhaar=NULL`, `Income=0`, `Category='General'`. | |

**[INSERT SCREENSHOT: Citizen Dashboard showing logged-in user's name after Google OAuth]**

**[INSERT SCREENSHOT: Login page displayed after logout confirming session was terminated]**

**[INSERT SCREENSHOT: MySQL Workbench showing newly auto-registered citizen row with NULL Aadhaar and Income=0]**

---

## 9.2 Subsystem 2: Citizen Enrollment & Profile Management

### Unit Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| ENRL-UT-01 | `GET /api/citizen/profile/1` returns John Doe's profile | Backend + DB running; `BeneficiaryID=1` exists | 1. `GET http://localhost:5000/api/citizen/profile/1`. 2. Inspect response. | `200 OK`; `{"BeneficiaryID":1,"Name":"John Doe","Email":"john@example.com","Income":45000,"Category":"General"}`. | |
| ENRL-UT-02 | Profile endpoint returns 404 for non-existent ID | Backend running; no citizen with `BeneficiaryID=9999` | 1. `GET http://localhost:5000/api/citizen/profile/9999`. | `404 Not Found`; `{"message":"Not found"}`. | |
| ENRL-UT-03 | `Email` UNIQUE constraint rejects duplicate | MySQL Workbench; `john@example.com` exists | 1. Execute: `INSERT INTO individualbeneficiaries (Name,Email,Aadhaar,Income,Category) VALUES ('Dup','john@example.com','999999999999',0,'General');` | `ERROR 1062: Duplicate entry 'john@example.com' for key 'Email'`. Insert rejected. | |
| ENRL-UT-04 | `Aadhaar` UNIQUE constraint rejects duplicate | MySQL; Aadhaar `123456789012` exists (John Doe) | 1. Execute: `INSERT INTO individualbeneficiaries (Name,Email,Aadhaar,Income,Category) VALUES ('Test','new@test.com','123456789012',0,'General');` | `ERROR 1062: Duplicate entry '123456789012' for key 'Aadhaar'`. Insert rejected. | |

**[INSERT SCREENSHOT: Postman showing John Doe's profile data returned from /api/citizen/profile/1]**

**[INSERT SCREENSHOT: Postman showing 404 response for BeneficiaryID=9999]**

**[INSERT SCREENSHOT: MySQL Workbench showing ERROR 1062 on duplicate Email insert]**

**[INSERT SCREENSHOT: MySQL Workbench showing ERROR 1062 on duplicate Aadhaar insert]**

### Integration Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| ENRL-IT-01 | Auto-registration inserts correct data on first login | Backend + DB running; use new Google account not in any table | 1. `SELECT COUNT(*) FROM individualbeneficiaries;` — note count. 2. Login via OAuth with new account. 3. `SELECT * FROM individualbeneficiaries ORDER BY BeneficiaryID DESC LIMIT 1;` | New row: `Name`=Google display name, `Email`=Google email, `Aadhaar=NULL`, `Income=0.00`, `Category='General'`. Count incremented by 1. | |
| ENRL-IT-02 | Returning citizen does NOT create duplicate row | `john@example.com` exists | 1. Note `BeneficiaryID`: `SELECT BeneficiaryID FROM individualbeneficiaries WHERE Email='john@example.com';`. 2. Login as John. 3. Re-run query. | Same `BeneficiaryID` returned. Row count unchanged. No duplicate. | |
| ENRL-IT-03 | OAuth callback maps existing citizen ID to session | `john@example.com` exists with `BeneficiaryID=1` | 1. Login as John via OAuth. 2. `GET /auth/me`. | `{userId:1, role:"citizen", name:"John Doe", email:"john@example.com"}`. `userId` matches `BeneficiaryID`. | |

**[INSERT SCREENSHOT: MySQL showing new auto-registered beneficiary row with NULL Aadhaar and Income=0]**

**[INSERT SCREENSHOT: MySQL showing same BeneficiaryID before and after re-login — no duplicate row]**

**[INSERT SCREENSHOT: Postman /auth/me showing userId=1 matching John Doe's BeneficiaryID]**

### System Tests (Black-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------|
| ENRL-ST-01 | Citizen Dashboard renders profile data | Citizen logged in | 1. Login as registered citizen. 2. Navigate to Citizen Dashboard. 3. View profile section. | Dashboard shows Name, Email, Income, Category matching the database record. | |
| ENRL-ST-02 | New user sees default profile after first login | New Google account | 1. Clear cookies. 2. Login with new Google account. 3. View profile on Citizen Dashboard. | Profile shows: Name and Email from Google, `Income=0`, `Category=General`. | |

**[INSERT SCREENSHOT: Citizen Dashboard UI showing profile section with Name, Email, Income, Category]**

**[INSERT SCREENSHOT: New citizen's dashboard showing default Income=0 and Category=General after first login]**

---

## 9.3 Subsystem 3: Scheme Discovery & Application Processing

### Unit Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------| 
| SCHM-UT-01 | Verify `GET /api/citizen/schemes` returns only active schemes | Backend + DB running. Seed data: `National Health Grant` (`isactive=1`) and `Education Scholarship` (`isactive=0`). | 1. Open Postman. 2. `GET http://localhost:5000/api/citizen/schemes`. 3. Inspect response array. | `200 OK`. Array contains exactly **one** object: `National Health Grant`. `Education Scholarship` is **absent**. Each object has: `SchemeID`, `SchemeName`, `Description`, `isactive`, `max_income`. | |
| SCHM-UT-02 | Verify inactive scheme is excluded from citizen scheme list | Backend + DB running. `Education Scholarship` has `isactive = 0`. | 1. SQL: `SELECT * FROM welfareschemes WHERE isactive = 0;` — confirm inactive. 2. `GET /api/citizen/schemes`. 3. Verify `Education Scholarship` absent. | SQL confirms inactive status. API response excludes `Education Scholarship`. `WHERE isactive = 1` filter correctly applied. | |
| SCHM-UT-03 | Verify `GET /api/citizen/track/:recordId` returns application details | Backend + DB running. Application `RecordID=1` exists. | 1. `GET http://localhost:5000/api/citizen/track/1`. 2. Inspect response. | `200 OK`. Body: `{"RecordID": 1, "SchemeName": "National Health Grant", "Status": "Pending", "Applied_on": "<timestamp>"}`. | |
| SCHM-UT-04 | Verify track endpoint returns 404 for non-existent RecordID | Backend running. No application with `RecordID=9999`. | 1. `GET http://localhost:5000/api/citizen/track/9999`. | `404 Not Found`. Body: `{"message": "Application not found"}`. | |
| SCHM-UT-05 | Verify `Applied_on` auto-populated via `CURRENT_TIMESTAMP` | Backend + DB running. `BeneficiaryID=1` and `SchemeID=1` exist. | 1. `POST http://localhost:5000/api/citizen/apply` with `{"citizen_id": 1, "scheme_id": 1}`. 2. SQL: `SELECT Applied_on FROM currentapplications ORDER BY RecordID DESC LIMIT 1;` | `Applied_on` contains a valid timestamp matching current server time. Value auto-generated by MySQL `DEFAULT CURRENT_TIMESTAMP` — not supplied by client. | |

**[INSERT SCREENSHOT: Postman response showing only the active scheme (National Health Grant) returned from /api/citizen/schemes]**

**[INSERT SCREENSHOT: MySQL confirming Education Scholarship isactive=0, alongside Postman response excluding it]**

**[INSERT SCREENSHOT: Postman showing track response with RecordID, SchemeName, Status, and Applied_on]**

**[INSERT SCREENSHOT: Postman showing 404 response for non-existent RecordID 9999]**

**[INSERT SCREENSHOT: MySQL Workbench showing Applied_on timestamp auto-generated in the new currentapplications row]**

### Integration Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------| 
| SCHM-IT-01 | Verify `POST /api/citizen/apply` inserts a row with `Status='Pending'` | Backend + DB running. `BeneficiaryID=1`, `SchemeID=1` exist. Re-seed DB. | 1. `SELECT COUNT(*) FROM currentapplications;` — note count. 2. `POST /api/citizen/apply` with `{"citizen_id": 1, "scheme_id": 1}`. 3. Inspect response. 4. `SELECT * FROM currentapplications ORDER BY RecordID DESC LIMIT 1;` | `200 OK`, `{"success": true, "message": "Application submitted!"}`. New row: `BeneficiaryID=1`, `SchemeID=1`, `Status='Pending'`. Row count incremented by 1. | |
| SCHM-IT-02 | Verify FOREIGN KEY constraint rejects invalid SchemeID | Backend + DB running. No scheme with `SchemeID=9999`. | 1. `POST /api/citizen/apply` with `{"citizen_id": 1, "scheme_id": 9999}`. 2. Inspect response. | `500 Internal Server Error`. Body: `{"message": "Error submitting application"}`. InnoDB `FOREIGN KEY` violation on `SchemeID`. No row created in `currentapplications`. | |
| SCHM-IT-03 | Verify `GET /api/citizen/applications/:beneficiaryId` returns correct joined data | `BeneficiaryID=1` has at least one application (from SCHM-IT-01). | 1. `GET http://localhost:5000/api/citizen/applications/1`. 2. Inspect response array. | `200 OK`. Array contains objects with: `RecordID`, `SchemeName` (joined from `welfareschemes`), `Status`, `Applied_on`. Ordered by `Applied_on DESC`. | |
| SCHM-IT-04 | Verify eligibility boundary — citizen income at scheme `max_income` limit | `National Health Grant` has `max_income=50000`. `John Doe` has `Income=45000`. | 1. `POST /api/citizen/apply` with `{"citizen_id": 1, "scheme_id": 1}`. 2. Check response. 3. Verify row in `currentapplications`. | Application accepted. `Status='Pending'`. Income below `max_income` — application allowed. *(Note: Income validation is UI-guided; backend accepts all submissions — document as observation.)* | |

**[INSERT SCREENSHOT: Postman showing 200 OK from /apply, AND MySQL showing new Pending row in currentapplications]**

**[INSERT SCREENSHOT: Postman showing 500 error response when submitting with non-existent scheme_id=9999]**

**[INSERT SCREENSHOT: Postman response from /api/citizen/applications/1 showing joined SchemeName and Status]**

**[INSERT SCREENSHOT: Postman showing successful apply response for income-eligible citizen]**

### System Tests (Black-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------| 
| SCHM-ST-01 | Citizen browses active schemes on UI | Citizen logged in. Frontend + Backend running. | 1. Login as citizen. 2. Navigate to "Browse Schemes". 3. Observe scheme list. | Only active schemes displayed (`National Health Grant`). Inactive schemes absent. Each card shows name, description, and eligibility info. | |
| SCHM-ST-02 | Citizen applies for a scheme and receives confirmation | Citizen logged in. At least one active scheme visible. | 1. Click "Apply" on `National Health Grant`. 2. Submit form. 3. Observe UI response. | Success confirmation displayed (e.g., "Application submitted!"). No crash. New application visible in citizen's application list. | |
| SCHM-ST-03 | Citizen tracks application status by RecordID | Citizen has a submitted application. Track Application feature accessible. | 1. Navigate to "Track Application". 2. Enter `RecordID` of submitted application. 3. Click "Track". | Application details shown: `SchemeName`, `Status='Pending'`, `Applied_on` timestamp. UI reflects database state. | |
| SCHM-ST-04 | Citizen application history shows all submissions | Citizen has multiple applications submitted. | 1. Login as citizen. 2. Navigate to "My Applications". 3. Observe list. | All submitted applications listed with `SchemeName` and current `Status`. Most recent application at the top. | |

**[INSERT SCREENSHOT: Citizen portal UI showing the Browse Schemes page with only active schemes listed]**

**[INSERT SCREENSHOT: Citizen portal showing success message after clicking Apply]**

**[INSERT SCREENSHOT: Citizen portal Track Application screen showing Pending status with scheme name and date]**

**[INSERT SCREENSHOT: Citizen portal My Applications page showing a list of applications with statuses]**

---

## 9.4 Subsystem 4: Workflow Automation & Decision Management

### Unit Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------| 
| WKFL-UT-01 | Verify `PUT /api/officer/applications/:id/approve` updates Status to `'Approved'` | Backend + DB running. `RecordID=1` with `Status='Pending'`. | 1. `PUT http://localhost:5000/api/officer/applications/1/approve`. 2. Inspect response. 3. SQL: `SELECT Status FROM currentapplications WHERE RecordID=1;` | `200 OK`, `{"success": true, "message": "Application 1 successfully marked as Approved."}`. SQL confirms `Status='Approved'`. | |
| WKFL-UT-02 | Verify `PUT /api/officer/applications/:id/reject` updates Status to `'Rejected'` | Backend + DB running. Re-seed DB. `RecordID=1` is `Status='Pending'`. | 1. `PUT http://localhost:5000/api/officer/applications/1/reject`. 2. Inspect response. 3. SQL: `SELECT Status FROM currentapplications WHERE RecordID=1;` | `200 OK`, `{"success": true, "message": "Application 1 successfully marked as Rejected."}`. SQL confirms `Status='Rejected'`. | |
| WKFL-UT-03 | Verify audit log entry created on Approve action | Backend + DB running. Note `auditlogs` row count. `RecordID=1` is `Status='Pending'`. | 1. `PUT /api/officer/applications/1/approve`. 2. SQL: `SELECT * FROM auditlogs ORDER BY LogID DESC LIMIT 1;` | New row: `ActorType='Officer'`, `ActionDetails='Approved application #1'`. `ActionTime` matches current server time. Row count incremented by 1. | |
| WKFL-UT-04 | Verify audit log entry created on Reject action | Backend + DB running. `RecordID=1` is `Status='Pending'` (re-seed). | 1. `PUT /api/officer/applications/1/reject`. 2. SQL: `SELECT * FROM auditlogs ORDER BY LogID DESC LIMIT 1;` | New row: `ActorType='Officer'`, `ActionDetails='Rejected application #1'`. | |

**[INSERT SCREENSHOT: Postman showing 200 approve response AND MySQL confirming Status='Approved']**

**[INSERT SCREENSHOT: Postman showing 200 reject response AND MySQL confirming Status='Rejected']**

**[INSERT SCREENSHOT: MySQL Workbench showing new auditlogs row with ActorType=Officer and Approved application #1]**

**[INSERT SCREENSHOT: MySQL Workbench showing auditlogs row for Rejected application #1]**

### Integration Tests (White-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------| 
| WKFL-IT-01 | Verify officer queue returns all Pending applications with joined data | Backend + DB running. At least one `Status='Pending'` application exists. | 1. `GET http://localhost:5000/api/officer/queue/1`. 2. Inspect response array. | `200 OK`. Array contains objects with: `RecordID`, `Name` (citizen), `Email`, `Aadhaar`, `Income`, `SchemeName`, `Applied_on`, `Status='Pending'`. Correctly joined from `individualbeneficiaries` and `welfareschemes`. | |
| WKFL-IT-02 | Verify approved application disappears from the Pending queue | Backend + DB running. `RecordID=1` is `Status='Pending'`. | 1. `GET /api/officer/queue/1` — note `RecordID=1` present. 2. `PUT /api/officer/applications/1/approve`. 3. `GET /api/officer/queue/1` again. | After approval, `RecordID=1` is **absent** from queue. `WHERE Status='Pending'` filter excludes the now-approved record. | |
| WKFL-IT-03 | Verify rejected application disappears from the Pending queue | Backend + DB running. Re-seed. `RecordID=1` is `Status='Pending'`. | 1. `GET /api/officer/queue/1` — note `RecordID=1` present. 2. `PUT /api/officer/applications/1/reject`. 3. `GET /api/officer/queue/1`. | After rejection, `RecordID=1` is **absent** from queue. Same `WHERE Status='Pending'` filter applies. | |
| WKFL-IT-04 | Verify end-to-end state propagation: Citizen sees Approved status | Backend + DB running. `RecordID=1` approved via WKFL-UT-01. | 1. `PUT /api/officer/applications/1/approve` (if not already done). 2. `GET /api/citizen/applications/1`. 3. Inspect `Status` field. | Response includes the application with `Status='Approved'`. Single source of truth in `currentapplications` ensures consistency across both officer and citizen endpoints. | |
| WKFL-IT-05 | Verify admin audit log records both officer decisions | Backend + DB running. At least one approve and one reject action performed. | 1. `GET http://localhost:5000/api/admin/auditlogs`. 2. Inspect response array. | `200 OK`. Entries with `ActorType='Officer'` for both approve and reject actions. Correct `ActionDetails` and `ActionTime`. Results ordered by `ActionTime DESC`. | |

**[INSERT SCREENSHOT: Postman response from /api/officer/queue/1 showing pending applications with joined citizen and scheme data]**

**[INSERT SCREENSHOT: Two Postman responses for /officer/queue — first showing RecordID=1, second showing it absent after approval]**

**[INSERT SCREENSHOT: Postman officer queue before and after rejection showing application removed]**

**[INSERT SCREENSHOT: Postman /api/citizen/applications/1 response showing Status='Approved' after officer action]**

**[INSERT SCREENSHOT: Postman /api/admin/auditlogs response showing Officer approval and rejection log entries]**

### System Tests (Black-Box)

| Test ID | Description | Pre-conditions | Steps | Expected Result | Pass/Fail |
|---------|-------------|----------------|-------|-----------------|-----------| 
| WKFL-ST-01 | Officer views pending application queue on dashboard | Officer (`aarti@govt.in`) logged in via OAuth. At least one `Status='Pending'` application exists. | 1. Login as Officer. 2. Navigate to Officer Dashboard. 3. Observe applications queue. | Dashboard displays pending applications. Each row shows citizen name, scheme name, income, and applied date. UI renders without errors. | |
| WKFL-ST-02 | Officer approves an application — status updates in Citizen portal | Officer logged in. At least one `Status='Pending'` application visible in queue. | 1. Click "Approve" on an application. 2. Observe queue after action. 3. Login as corresponding Citizen. 4. Navigate to "My Applications". 5. Find the same application. | Application disappears from officer queue. In Citizen portal, the same application shows `Status='Approved'`. | |
| WKFL-ST-03 | Officer rejects an application — status updates in Citizen portal | Officer logged in. A different `Status='Pending'` application visible. | 1. Click "Reject" on an application. 2. Observe queue. 3. Login as the affected citizen. 4. Check "My Applications". | Rejected application disappears from officer queue. Citizen portal shows `Status='Rejected'` for that application. | |
| WKFL-ST-04 | Admin views complete audit log including officer decisions | Admin (`admin@govt.in`) logged in. At least one approve/reject action recorded. | 1. Login as Admin. 2. Navigate to Audit Logs section of Admin Dashboard. 3. Observe log entries. | Audit log table displays entries with `ActorType`, `ActionDetails`, and `ActionTime`. Officer approval and rejection entries visible with correct application IDs and timestamps. | |

**[INSERT SCREENSHOT: Officer Dashboard UI showing the pending applications queue with citizen details]**

**[INSERT SCREENSHOT: Officer queue after approval (application gone) AND Citizen portal showing Approved status]**

**[INSERT SCREENSHOT: Citizen portal showing Rejected status after officer rejection action]**

**[INSERT SCREENSHOT: Admin Dashboard Audit Log section showing Officer action entries with timestamps]**

---

<div style="page-break-after: always;"></div>

# 10. Testing Schedule

## 10.1 Overview

The testing activities are organized into four chronological phases mapped to the four targeted subsystems. This schedule assumes a single tester executing manual tests on a configured local development environment. Each phase includes time for setup, execution, evidence capture (screenshots), and defect logging.

## 10.2 Detailed Schedule

| Phase | Subsystem | Activities | Estimated Duration | Deliverables |
|-------|-----------|------------|-------------------|-------------|
| **Phase 0** | All Subsystems | **Environment Setup & Verification** — Install dependencies (`npm install`), seed database (`seed-database.sql`), start frontend and backend servers, verify health check endpoint (`/api/health`), clear all browser cookies and sessions. | 30 minutes | Verified running environment; health check screenshot. |
| **Phase 1** | Authentication & Access Control | **Unit Tests** (AUTH-UT-01 to AUTH-UT-04) — Postman API calls, session inspection. **Integration Tests** (AUTH-IT-01 to AUTH-IT-05) — OAuth login flow for each role, session persistence, RBAC boundary tests. **System Tests** (AUTH-ST-01 to AUTH-ST-03) — Browser-based login/logout, auto-registration. | 1.5 hours | Completed test case table with PASS/FAIL verdicts and screenshots for all 12 Auth test cases. |
| **Phase 2** | Citizen Enrollment & Profile Management | **Unit Tests** (ENRL-UT-01 to ENRL-UT-04) — Profile endpoint and DB constraint tests. **Integration Tests** (ENRL-IT-01 to ENRL-IT-03) — Auto-registration and session mapping. **System Tests** (ENRL-ST-01 to ENRL-ST-02) — Dashboard profile rendering. | 1 hour | Completed test case table with verdicts and screenshots for all 9 Enrollment test cases. |
| **Phase 3** | Scheme Discovery & Application Processing | **Unit Tests** (SCHM-UT-01 to SCHM-UT-05) — Scheme API filtering, track endpoint, timestamp verification. **Integration Tests** (SCHM-IT-01 to SCHM-IT-04) — Application submission, FK constraint, joined data. **System Tests** (SCHM-ST-01 to SCHM-ST-04) — Browse, apply, track, and history UI flows. | 1.5 hours | Completed test case table with verdicts and screenshots for all 13 Scheme test cases. |
| **Phase 4** | Workflow Automation & Decision Management | **Unit Tests** (WKFL-UT-01 to WKFL-UT-04) — Approve/reject API, audit log insertion. **Integration Tests** (WKFL-IT-01 to WKFL-IT-05) — Queue updates, state propagation, admin audit view. **System Tests** (WKFL-ST-01 to WKFL-ST-04) — Full end-to-end officer and citizen UI workflow. | 2 hours | Completed test case table with verdicts and screenshots for all 13 Workflow test cases. |
| **Phase 5** | All Subsystems | **Defect Logging & Test Summary** — Compile all PASS/FAIL results, log any discovered defects with severity, calculate pass rates per subsystem, and insert all captured screenshots into placeholders. | 1 hour | Final test summary table; defect log (if any); complete Test Plan document with evidence. |

## 10.3 Testing Timeline (7-Day View)

| Day | Activity |
|-----|----------|
| **Day 1** | Phase 0: Environment Setup + Phase 1: Authentication Testing |
| **Day 2** | Phase 2: Citizen Enrollment Testing |
| **Day 3** | Phase 3: Scheme Discovery Testing |
| **Day 4** | Phase 4: Workflow Automation Testing |
| **Day 5** | Phase 5: Defect Logging, Evidence Compilation |
| **Day 6** | Screenshot insertion, document formatting, review |
| **Day 7** | Final submission preparation and PDF export |

## 10.4 Test Case Summary

| Subsystem | Unit Tests | Integration Tests | System Tests | Total |
|-----------|-----------|-------------------|--------------|-------|
| Authentication & Access Control | 4 | 5 | 3 | **12** |
| Citizen Enrollment & Profile Management | 4 | 3 | 2 | **9** |
| Scheme Discovery & Application Processing | 5 | 4 | 4 | **13** |
| Workflow Automation & Decision Management | 4 | 5 | 4 | **13** |
| **TOTAL** | **17** | **17** | **13** | **47** |

## 10.5 Testing Responsibilities

| Role | Responsibility |
|------|---------------|
| **Tester (Student)** | Execute all 47 test cases, capture screenshot evidence, record PASS/FAIL verdicts, log defects. |
| **Developer (Student)** | Ensure test environment is correctly configured, resolve Severity-1/2 defects identified during testing. |
| **Lab Evaluator (Instructor)** | Review the completed Test Plan document with evidence against the grading rubric for Laboratory-10. |

---

<br>

<div style="text-align: center; color: #64748b; margin-top: 50px;">

---

**Complete Test Plan — Laboratory 10**

*Government Welfare Eligibility & Tracking System*

*— End of Document —*

</div>
