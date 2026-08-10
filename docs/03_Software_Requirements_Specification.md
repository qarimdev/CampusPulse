# Software Requirements Specification (SRS) for CampusPulse

**Document ID:** CP-DOC-003  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead Software Architect / Business Analyst  
**Project:** CampusPulse Enterprise Campus Platform  

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) provides a comprehensive, formal definition of the functional, non-functional, business, and interface requirements for **CampusPulse**. It serves as the baseline agreement between stakeholders, software architects, developers, and QA engineers for system validation and auditability.

### 1.2 Scope
CampusPulse is a web-based, multi-tenant-capable higher education portal. The system encompasses 10 core functional modules:
1. Authentication & Role-Based Access Control (RBAC)
2. Student Profile Management
3. Club Management
4. Interest Communities
5. Event Lifecycle & Registration Engine
6. Campus Social Feed
7. Real-Time Community Chat
8. University Summons & Receipts
9. Notification Engine
10. Multi-Role Analytics Dashboards

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS:** Software Requirements Specification
- **RBAC:** Role-Based Access Control
- **HEP:** Hal Ehwal Pelajar (Student Affairs Division)
- **SPA:** Single Page Application (Angular)
- **JWT / Sanctum:** JSON Web Token / Laravel Sanctum Bearer Token
- **S3:** Amazon Simple Storage Service
- **RTM:** Requirement Traceability Matrix

---

## 2. Overall Description

### 2.1 Product Perspective
CampusPulse operates as a decoupled client-server web application:
- **Frontend Layer:** Angular SPA running in the user browser.
- **Backend Layer:** Laravel RESTful API executing core business logic.
- **Data Layer:** MySQL relational database for transactional persistence.
- **Storage Layer:** AWS S3 bucket for media files, event posters, and receipts.
- **Real-Time Layer:** WebSocket protocol (via Soketi / Pusher driver) for live chat and notifications.

### 2.2 User Classes and Characteristics
- **Student (STD):** Standard user capable of profile editing, joining clubs/communities, event registration, posting/commenting, chatting, and paying summons.
- **Club Committee (CMT):** Elevated privileges within specific clubs/events. Can issue club announcements, approve/reject club members, upload galleries, and create/manage events.
- **Student Affairs / HEP (HEP):** Administrative role responsible for issuing university summons, verifying payments, updating fine statuses, and managing official campus policy flags.
- **System Administrator (ADM):** Global access. Manages user accounts, assigns system roles, oversees platform health, audits activity logs, and moderates content across feeds and groups.

---

## 3. Specific Business Rules (BR)

Business rules govern how business logic is executed across all application layers:

- **BR-001 (Identity Verification):** Registration requires a valid university email address domain (e.g., `@student.university.edu`).
- **BR-002 (Club Ownership):** A club must have at least one assigned Committee Lead. A single student can hold a committee role in a maximum of 3 active clubs simultaneously.
- **BR-003 (Event Capacity Capping):** Event registration must automatically lock when confirmed registrations reach `max_participants`. A waiting list queue takes over once capacity is filled.
- **BR-004 (Summon Payment Settlement):** A summon status can transition from `UNPAID` to `PAID` only upon valid transaction token confirmation. Receipts must generate a cryptographically unique audit hash.
- **BR-005 (Content Moderation):** Posts or comments reported by 5 or more unique users are automatically flagged for Administrator review and hidden from public feeds pending moderation.
- **BR-006 (Role Hierarchy):** Privileges are strictly cumulative down the hierarchy: `Admin` > `HEP` > `Committee` > `Student`.

---

## 4. Functional Requirements (FR)

Requirements are tagged with a unique identifier (`FR-<MODULE>-<ID>`) and prioritized using MoSCoW (Must Have, Should Have, Could Have, Won't Have).

### 4.1 Authentication & RBAC (FR-AUTH)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-AUTH-001** | System shall allow users to register using university email, password, and basic credentials. | Must Have |
| **FR-AUTH-002** | System shall dispatch an email verification token upon registration via asynchronous queue. | Must Have |
| **FR-AUTH-003** | System shall authenticate users via Laravel Sanctum and return a secure HTTP-Only / Bearer API token. | Must Have |
| **FR-AUTH-004** | System shall enforce RBAC middleware on every restricted API endpoint based on authenticated user tokens. | Must Have |
| **FR-AUTH-005** | System shall allow password resets via time-sensitive secure token links sent to registered emails. | Must Have |

### 4.2 Student Profile Management (FR-PROF)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-PROF-001** | System shall allow students to view and update personal profile attributes (Faculty, Program, Year, Bio, Interests). | Must Have |
| **FR-PROF-002** | System shall allow students to upload/crop profile images stored directly to AWS S3. | Must Have |
| **FR-PROF-003** | System shall display student activity summaries (joined clubs, attended events, feed posts) on public profile views. | Should Have |

### 4.3 Club Management (FR-CLUB)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-CLUB-001** | System shall allow students to browse, search, filter, and join or leave official clubs. | Must Have |
| **FR-CLUB-002** | Club Committee members shall be able to approve, reject, or kick club members via a committee dashboard. | Must Have |
| **FR-CLUB-003** | Club Committee members shall be able to post official club announcements and maintain an image photo gallery. | Must Have |

### 4.4 Interest Communities (FR-COMM)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-COMM-001** | System shall support open interest communities categorized under Sports, Tech, Lifestyle, etc. | Must Have |
| **FR-COMM-002** | System shall allow any registered student to freely join or leave interest communities without approval gates. | Must Have |
| **FR-COMM-003** | Each community shall feature a dedicated discussion board, media library, and integrated real-time chat room. | Must Have |

### 4.5 Event Lifecycle & Registration (FR-EVNT)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-EVNT-001** | Committee members shall be able to create events with parameters: title, poster image, venue, capacity limit, and deadline. | Must Have |
| **FR-EVNT-002** | System shall allow students to register for events, lock seats in real time, or join a waiting list if full. | Must Have |
| **FR-EVNT-003** | System shall allow students to bookmark upcoming events and add them to an interactive personal calendar. | Should Have |
| **FR-EVNT-004** | System shall generate a unique QR code ticket for every confirmed event registrant. | Should Have |

### 4.6 Campus Social Feed (FR-FEED)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-FEED-001** | Students shall be able to create, edit, and delete social feed posts with optional media attachments. | Must Have |
| **FR-FEED-002** | Students shall be able to like, comment on, and share posts in a threaded conversation format. | Must Have |
| **FR-FEED-003** | System shall serve infinite-scroll feeds with cursor-based pagination to optimize query performance. | Should Have |

### 4.7 Real-Time Community Chat (FR-CHAT)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-CHAT-001** | System shall transmit and render live chat messages across community members using WebSockets. | Must Have |
| **FR-CHAT-002** | System shall support image sharing and reply-to message threading inside community chat streams. | Should Have |
| **FR-CHAT-003** | System shall persist chat history in MySQL with full-text indexed search capability. | Must Have |

### 4.8 University Summons & Payments (FR-SUMM)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-SUMM-001** | Student Affairs (HEP) users shall be able to issue summons against student IDs with violation details and fine amounts. | Must Have |
| **FR-SUMM-002** | Students shall view outstanding summons, initiate payment workflow, and submit transaction verification tokens. | Must Have |
| **FR-SUMM-003** | System shall render downloadable, cryptographically signed PDF payment receipts upon settlement. | Must Have |

### 4.9 Notification Engine (FR-NOTIF)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-NOTIF-001** | System shall emit real-time in-app notifications for direct interactions (event updates, summons issued, post comments). | Must Have |
| **FR-NOTIF-002** | System shall send digest emails asynchronously for critical administrative notices or summons alerts. | Should Have |

### 4.10 Multi-Role Dashboards (FR-DASH)

| Req ID | Description | Priority |
| :--- | :--- | :--- |
| **FR-DASH-001** | Student Dashboard shall display joined clubs, upcoming booked events, active summons, and personal feed stats. | Must Have |
| **FR-DASH-002** | Committee Dashboard shall display member rosters, event capacity utilization, and engagement charts. | Must Have |
| **FR-DASH-003** | Admin Dashboard shall display platform-wide metrics: user growth, total summons collected, active sessions, and system logs. | Must Have |

---

## 5. Non-Functional Requirements (NFR)

### 5.1 Performance & Scalability (NFR-PERF)
- **NFR-PERF-001:** API response times for standard read/write transactions must maintain a 95th percentile under 200ms.
- **NFR-PERF-002:** The application must support up to 1,000 concurrent active WebSocket connections without memory degradation.
- **NFR-PERF-003:** Image uploads must be compressed client-side prior to transfer, capped at a maximum server limit of 5MB per media file.

### 5.2 Security & Compliance (NFR-SEC)
- **NFR-SEC-001:** All HTTP communication must enforce HTTPS/TLS 1.3 encryption in transit.
- **NFR-SEC-002:** User passwords must be hashed using `Bcrypt` with a default cost factor of 12.
- **NFR-SEC-003:** Form inputs across Angular and Laravel endpoints must protect against SQL Injection (PDO bindings), Cross-Site Scripting (XSS sanitization), and Cross-Site Request Forgery (CSRF protection).
- **NFR-SEC-004:** File uploads to AWS S3 must utilize pre-signed short-lived URLs (valid for max 15 minutes).

### 5.3 Availability & Reliability (NFR-REL)
- **NFR-REL-001:** The system shall maintain 99.5% operational uptime during academic semesters.
- **NFR-REL-002:** Database backups (AWS RDS Automated Backups) shall occur daily with a 7-day point-in-time recovery retention period.

### 5.4 Usability & Accessibility (NFR-USE)
- **NFR-USE-001:** The user interface must be fully mobile-responsive (breakpoints: 320px mobile up to 1920px desktop views).
- **NFR-USE-002:** UI components must pass WCAG 2.1 Level AA color contrast standards.

---

## 6. Requirement Traceability Matrix (RTM)

The RTM links functional requirements directly to system modules, test suites, and deployment components:

| Requirement ID | Module | Priority | Architectural Component | Verification Method |
| :--- | :--- | :---: | :--- | :--- |
| **FR-AUTH-001..005** | Auth & RBAC | Must Have | `AuthController`, `SanctumMiddleware`, `AuthService` | Unit & Integration Test |
| **FR-PROF-001..003** | Profile | Must Have | `ProfileController`, `S3StorageService`, `ProfileComponent` | Feature Integration Test |
| **FR-CLUB-001..003** | Clubs | Must Have | `ClubController`, `ClubRepository`, `ClubListComponent` | Integration & E2E Test |
| **FR-COMM-001..003** | Communities | Must Have | `CommunityController`, `DiscussionComponent` | Integration Test |
| **FR-EVNT-001..004** | Events | Must Have | `EventController`, `BookingService`, `QRCodeService` | Concurrency & Unit Test |
| **FR-FEED-001..003** | Social Feed | Must Have | `FeedController`, `FeedComponent`, `CommentComponent` | UI/UX & API Test |
| **FR-CHAT-001..003** | Chat | Must Have | `ChatBroadcaster`, `WebSocketService`, `ChatRoom` | Load & E2E Test |
| **FR-SUMM-001..003** | Summons | Must Have | `SummonController`, `PaymentGatewayMock`, `PDFEngine` | Integration Test |
| **FR-NOTIF-001..002** | Notifications | Must Have | `NotificationService`, `SendEmailJob` | Async Queue Test |
| **FR-DASH-001..003** | Dashboards | Must Have | `AnalyticsController`, `ChartEngineComponent` | System Acceptance Test |