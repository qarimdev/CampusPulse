# Use Case Specification Document: CampusPulse

**Document ID:** CP-DOC-004  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead Business Analyst & Technical Lead  
**Project:** CampusPulse Enterprise Campus Platform  

---

## 1. Actor Directory

| Actor Name | Description | Key Responsibilities |
| :--- | :--- | :--- |
| **Student (STD)** | Authenticated student user. | Browse/join clubs & communities, register for events, post to campus feed, chat, pay summons. |
| **Club Committee (CMT)** | Elevated student lead assigned to a club. | Manage club membership, post official announcements, upload galleries, create & host events. |
| **Student Affairs (HEP)** | Administrative institutional staff. | Issue parking/conduct summons, verify fine payments, review student appeals. |
| **System Administrator (ADM)**| Global platform administrator. | Manage system roles, oversee platform logs, moderate flagged content, manage global settings. |

---

## 2. High-Level Use Case Index

[ Student ]          [ Committee ]          [ HEP Officer ]         [ Admin ]
- UC-01 Auth & Profile - UC-04 Manage Club      - UC-07 Issue Summons   - UC-09 Moderation
- UC-02 Join Club      - UC-05 Create Event     - UC-08 Verify Payment  - UC-10 Analytics
- UC-03 Feed Post      - UC-06 Scan QR Ticket

---

## 3. Detailed Use Case Specifications

### UC-01: User Registration & Email Verification
- **Primary Actor:** Student (STD)
- **Pre-conditions:** User is unauthenticated and possesses an official university email address (`@student.university.edu`).
- **Post-conditions:** A student user record is created in `users` and `student_profiles` tables with `status = 'pending'`, and a verification token is dispatched via email.

#### Primary Success Scenario
1. Student navigates to the Registration page on the Angular SPA.
2. Student submits full name, university email, matrix ID, faculty, program, and password.
3. System validates input data against validation constraints (BR-001).
4. System creates user record with password hashed via `Bcrypt`.
5. System fires an asynchronous queue job (`SendVerificationEmailJob`) containing a time-sensitive verification token URL.
6. System returns HTTP 201 Created response.
7. Student clicks link in email; Angular routes token to `POST /api/v1/auth/verify-email`.
8. System updates `email_verified_at` timestamp and changes user status to `active`.

#### Alternative & Exception Flows
- **Alt-1a (Invalid Email Domain):** Email domain is not recognized. System aborts with HTTP 422 Unprocessable Entity ("Must use an official university email").
- **Alt-1b (Duplicate Email/Matrix ID):** Record exists. System responds with HTTP 409 Conflict.

---

### UC-02: Event Registration with Seat Reservation (Concurrency Locking)
- **Primary Actor:** Student (STD)
- **Pre-conditions:** Student is authenticated; target event is published and `registration_deadline` has not elapsed.
- **Post-conditions:** Student seat is confirmed, `event_registrations` record created with a unique QR code hash, and a notification is dispatched.

#### Primary Success Scenario
1. Student views event details page and clicks **Register for Event**.
2. Angular SPA posts request to `POST /api/v1/events/{id}/register`.
3. System opens an atomic database transaction using `SELECT FOR UPDATE` on the event row.
4. System checks current registration count against `max_participants` (BR-003).
5. Current count is less than `max_participants`. System inserts registration record with `status = 'confirmed'`.
6. System generates a cryptographically unique SHA-256 string for the ticket QR code.
7. System commits database transaction and returns HTTP 201 Created with ticket payload.
8. System dispatches real-time in-app notification to Student.

#### Alternative & Exception Flows
- **Alt-2a (Capacity Reached / Race Condition):** Capacity is full upon row lock check. System inserts registration with `status = 'waitlisted'` or returns HTTP 400 Bad Request ("Event capacity full").
- **Alt-2b (Already Registered):** Student has existing registration for event. System aborts with HTTP 422 Unprocessable Entity ("User already registered").

---

### UC-03: Create Campus Feed Post with Media Uploads
- **Primary Actor:** Student (STD)
- **Pre-conditions:** Student is authenticated with an active account status.
- **Post-conditions:** Post record is saved in MySQL, media files are stored on AWS S3, and post appears in feed queries.

#### Primary Success Scenario
1. Student inputs post text and attaches 1–3 images via the Angular Feed component.
2. Client-side script validates file sizes (<5MB per file) and image MIME types.
3. Angular requests AWS S3 pre-signed upload URLs from `POST /api/v1/media/presigned-url`.
4. System generates short-lived S3 upload links and returns them to client.
5. Angular uploads image files directly to AWS S3 bucket.
6. Angular submits post payload (content + S3 media keys) to `POST /api/v1/posts`.
7. System sanitizes content text, inserts post record, and returns HTTP 201 Created.

#### Alternative & Exception Flows
- **Alt-3a (File Size Limit Exceeded):** Client or API validation fails image size (>5MB). Request rejected prior to processing.

---

### UC-04: Issue University Summons
- **Primary Actor:** Student Affairs Officer (HEP)
- **Pre-conditions:** User is authenticated with `role = 'hep'`. Target student exists in the system.
- **Post-conditions:** Citation record inserted into `summons` table; real-time notification & email alert dispatched to student.

#### Primary Success Scenario
1. HEP Officer inputs Student Matrix ID, violation type, location, fine amount, and due date into the HEP portal.
2. System validates student matrix ID exists.
3. System generates a unique citation code (e.g., `SUM-2026-00411`).
4. System inserts record into `summons` table with `status = 'unpaid'`.
5. System triggers an asynchronous notification queue job (`SummonIssuedNotification`).
6. System returns HTTP 201 Created with summons citation details.

---

### UC-05: Pay Summons & Download PDF Receipt
- **Primary Actor:** Student (STD)
- **Pre-conditions:** Student is authenticated and has an outstanding summons with `status = 'unpaid'`.
- **Post-conditions:** Summons status transitions to `'paid'`, transaction record created in `summon_receipts`, and PDF receipt generated on S3.

#### Primary Success Scenario
1. Student selects unpaid summons from dashboard and clicks **Pay Fine**.
2. System processes payment token via Mock Payment Gateway integration service.
3. Upon gateway confirmation hash match, system updates `summons.status` to `'paid'` (BR-004).
4. System invokes `PDFEngine` service to render a signed PDF receipt.
5. System uploads PDF receipt to AWS S3 and stores location in `summon_receipts`.
6. System returns HTTP 200 OK with direct download URL for PDF receipt.

#### Alternative & Exception Flows
- **Alt-5a (Payment Gateway Failure):** Payment token fails verification. System rolls back transaction and sets summons status to `'unpaid'` with HTTP 402 Payment Required response.