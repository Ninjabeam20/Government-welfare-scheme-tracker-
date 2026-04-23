# Laboratory 10: Test Plan Implementation Strategy

This plan outlines how we will tackle the Laboratory-10 assignment for your Government Welfare Eligibility & Tracking System project. We will create a comprehensive Test Plan focusing specifically on the 4 requested subsystems.

## Proposed Approach

I will generate a structured markdown document (`Test_Plan.md`) that fulfills all the requirements of your lab assignment.

### 1. Document Structure
I will create the documentation following the exact 10-point structure requested in the image:
1. **Introduction:** Objective of testing the Welfare Tracking System.
2. **Relationship to other documents:** Referencing your `Project_Report.md` and System Design Document.
3. **System overview:** A brief summary of the Tri-Portal architecture (React + Node.js + MySQL).
4. **Features to be tested/not to be tested:** Explicitly stating we are testing the 4 chosen subsystems and excluding things like 3rd party Google Auth internals.
5. **Pass/Fail criteria:** Defining what constitutes a successful test execution.
6. **Approach:** Detailing the use of Black-box (Functional UI testing) and White-box (Backend logic/Database constraints testing) techniques.
7. **Suspension and resumption:** Conditions under which testing pauses.
8. **Testing materials:** Software and hardware requirements (e.g., Browser, Node.js, MySQL).
9. **Test cases:** The core of the document, containing detailed tables for Unit, Integration, and System tests grouped by subsystem.
10. **Testing schedule:** A sample timeline for testing phases.

### 2. Test Case Design (Targeting the 4 Subsystems)
I will design a robust set of test cases categorized by technique and level for your specific subsystems:

#### Subsystem 1: Authentication & Access Control
*   **White-Box (Unit/Integration):** Test JWT session generation and validation. Test Role-Based Access Control (RBAC) middleware (e.g., citizen trying to hit an officer endpoint).
*   **Black-Box (System):** Verify Google OAuth login flow for Citizen. Verify manual login flow for Admin/Officer. Verify logout functionality.

#### Subsystem 2: Citizen Enrollment & Profile Management
*   **White-Box (Unit/Integration):** Test the database query logic for inserting/updating a `BeneficiaryRecord` into `individualbeneficiaries`. Verify constraints like unique Aadhaar numbers throw correct SQL errors.
*   **Black-Box (System):** Verify a citizen can update their profile demographics from the dashboard UI and see the changes reflected immediately.

#### Subsystem 3: Scheme Discovery & Application Processing
*   **White-Box (Unit/Integration):** Test the `EligibilityChecker` logic (e.g., testing if an application is blocked if the citizen's income exceeds the scheme's `max_income`). Test the insertion of an `ApplicationRecord` linking Beneficiary and Scheme.
*   **Black-Box (System):** Verify a citizen can browse active schemes, click "Apply", submit the required form data, and receive a Tracking ID.

#### Subsystem 4: Workflow Automation & Decision Management
*   **White-Box (Unit/Integration):** Test the `DecisionManager` logic updating the `Status` field in `currentapplications`. Verify `RoutingLog` or `AuditLog` is updated upon status change.
*   **Black-Box (System):** Verify an Officer can view the queue of pending applications, select an application, click "Approve" or "Reject", and verify the status change is reflected in the Citizen's portal.

### 3. Screenshot Strategy
I will embed clear **placeholders** in the document telling you exactly what to screenshot and where to paste it to prove execution. For example:
*   `[INSERT SCREENSHOT: Postman API response showing successful 200 OK for Authentication Test]`
*   `[INSERT SCREENSHOT: Citizen Dashboard UI showing "Application Submitted" success message]`
*   `[INSERT SCREENSHOT: MySQL Workbench showing the new row inserted in currentapplications table after Workflow Decision]`

> [!IMPORTANT]
> The test cases will be written for **Manual Execution**. You will follow the documented steps, use your browser/Postman/MySQL, take screenshots, and insert them into the placeholders to complete the report.

## User Review Required

Please review this updated plan targeting your 4 specific subsystems.

## Open Questions

1.  **File Generation:** I will create this as a separate file named `Test_Plan.md` so it's clean and easy to export as a PDF or append to your main report later. Does this work for you?
2.  If everything looks good, just reply with **"Approved"** and I will immediately generate the full `Test_Plan.md` file with all the detailed test case tables!
