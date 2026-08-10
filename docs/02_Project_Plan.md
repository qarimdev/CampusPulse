# Project Plan & Development Methodology: CampusPulse

**Document ID:** CP-DOC-002  
**Version:** 1.0.0  

---

## 1. Development Methodology: Agile Scrum

CampusPulse will be executed using an Agile Scrum framework structured into **6 bi-weekly Sprints (12 weeks total)**. Each sprint produces a testable, deployable increment of the system.

### Sprint Ceremonies & Artifacts
- **Sprint Planning:** Define sprint goals and select backlog items based on priority and velocity.
- **Sprint Backlog:** Documented user stories tagged with story points (Fibonacci scale: 1, 2, 3, 5, 8, 13).
- **Daily Standups (Self-Tracked):** Review progress: *What was completed yesterday? What is planned today? Are there any blockers?*
- **Sprint Review & Retrospective:** Demonstrate working software increments, evaluate test coverage, and document lessons learned.

---

## 2. Sprint Roadmap Breakdown

### Sprint 1: Architecture, Authentication & User Profiles (Weeks 1–2)
- **Objectives:** Establish Git repository, setup Angular & Laravel scaffolding, configure MySQL database, implement Sanctum Auth, and build student profile management.
- **Deliverables:** Working auth endpoints (register, login, logout, verify, reset), JWT/Sanctum token handling, Angular auth guards, profile photo upload to S3.

### Sprint 2: Clubs & Interest Communities (Weeks 3–4)
- **Objectives:** Build multi-tier organization logic (Clubs vs. Communities), member role assignments, gallery uploads, and community discussion boards.
- **Deliverables:** Club browsing/joining, committee management panel, announcement board, and community creation.

### Sprint 3: Event Lifecycle & Registration Engine (Weeks 5–6)
- **Objectives:** Implement event creation, capacity locks, registration workflows, calendar bookmarking, and venue/poster management.
- **Deliverables:** Event feed, registration validation engine, attendance tracking, and committee event management portal.

### Sprint 4: Social Campus Feed & Real-Time Community Chat (Weeks 7–8)
- **Objectives:** Build Facebook-style feed with media attachments, likes/comments, and WebSocket-driven real-time chat.
- **Deliverables:** Feed timeline with pagination, nested comments, media storage on AWS S3, and WebSocket connection via Pusher/Soketi for real-time messaging.

### Sprint 5: Summons Management, Notifications & Role Dashboards (Weeks 9–10)
- **Objectives:** Implement university summons workflow, payment simulation with receipt PDF generation, notification system, and role-specific analytics dashboards.
- **Deliverables:** HEP summons issuance panel, student fine payment UI, PDF export service, real-time/email notification pipeline, and charts/analytics for Student, Committee, and Admin roles.

### Sprint 6: Quality Assurance, Security Auditing, AWS Deployment & CI/CD (Weeks 11–12)
- **Objectives:** Execute end-to-end integration testing, optimize database indexing/queries, build GitHub Actions deployment pipelines, configure AWS EC2/RDS/S3, and set up Nginx reverse proxy with SSL.
- **Deliverables:** Production deployment on AWS, passing test suites (>80% coverage), complete technical documentation set.

---

## 3. Repository & Directory Architecture

To maintain enterprise standards, the repository follows a clean, modular structure:

---

## 4. Git Branching & Commit Workflow

We follow **GitFlow Branching Model**:

- `main`: Production-ready code. Protected branch.
- `develop`: Integration branch for functional features.
- `feature/<feature-name>`: Short-lived branches created off `develop` for specific user stories.
- `bugfix/<issue-name>`: Bug fixes for integration testing.
- `hotfix/<issue-name>`: Critical fixes patched directly to `main`.

### Conventional Commits Format
Commits must strictly conform to Conventional Commits specifications: `<type>(<scope>): <short description>`

*Examples:*
- `docs: initialize project proposal and agile sprint plan`
- `feat(auth): implement Sanctum token authentication and middleware`
- `design(db): add relational database schema migration for summons module`
- `test(event): add unit test for event capacity limit concurrency`