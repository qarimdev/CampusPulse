# Project Charter & Proposal: CampusPulse

**Document ID:** CP-DOC-001  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead Software Architect & Development Team  
**Target Platform:** Web (Desktop & Mobile Responsive)  

---

## 1. Executive Summary

CampusPulse is a centralized, multi-tenant-capable higher education community platform designed to bridge the gap between academic institutions, student bodies, organized clubs, and interest-based communities. By unifying disparate communication channels into a secure, scalable web application, CampusPulse enhances campus engagement, streamlines event management, simplifies administrative tasks (such as summons payments), and provides real-time community interactions.

---

## 2. Problem Statement

At contemporary higher education institutions, communication and administrative workflows suffer from extreme fragmentation:

1. **Information Silos:** Official announcements, student club updates, and interest group discussions are scattered across third-party platforms (WhatsApp, Telegram, Instagram, Google Forms, and legacy university portals).
2. **Low Engagement & Visibility:** Events hosted by smaller student clubs frequently lack visibility due to algorithm-driven social platforms or cluttered messaging groups.
3. **Inefficient Administrative Processes:** Payment and tracking of university summons (e.g., parking fines, library violations) require manual physical visits or unintuitive legacy portals with poor user tracking.
4. **Data Isolation & Security Risks:** Student communities operate without central oversight, leading to privacy vulnerabilities and lack of verifiable institutional moderation.

---

## 3. Project Objectives & Value Proposition

### 3.1 Primary Objectives
- **Centralize Campus Ecosystem:** Deliver a single sign-on (SSO-ready) portal combining social feeds, club management, event registration, real-time messaging, and administrative payments.
- **Role-Driven Access Control (RBAC):** Implement granular access controls across four primary user personas (Student, Committee Member, HEP / Student Affairs, System Administrator).
- **Automate Financial & Administrative Workflows:** Provide an integrated summons management module with verifiable payment receipts and audit trails.
- **Enterprise-Grade System Design:** Architect a decoupled single-page application (SPA) using Angular, backed by a RESTful Laravel API, hosted on scalable AWS infrastructure.

### 3.2 Key Performance Indicators (KPIs)
- **Sub-200ms API Response Time:** Average response latency for core REST endpoints under normal load.
- **High Concurrency Support:** System capability to handle peak traffic (e.g., popular event registrations) up to 1,000 active concurrent WebSocket/HTTP connections.
- **Zero-Trust Security Alignment:** Token-based authentication, sanitized data inputs, role middleware validation on every endpoint, and encrypted data at rest/in transit.

---

## 4. Project Scope

### 4.1 In-Scope Features
- **Authentication & RBAC:** Multi-role authentication using Laravel Sanctum, email verification, password reset, and permission-based route guards.
- **Student Profile Management:** Extended profiles capturing faculty, academic program, year, interests, and bio.
- **Club & Community Modules:** Structural separation between officially recognized campus clubs (formal management, announcements, gallery) and open interest communities (discussions, group chat).
- **Event Lifecycle System:** Event creation, capacity caps, seat reservation, venue mapping, poster uploads, and calendar bookmarking.
- **Campus Social Feed:** Interactive social feed supporting post creation, image uploads, threaded comments, likes, and feed analytics.
- **Real-Time Community Chat:** WebSockets-powered messaging for interest communities (Pusher/Soketi driver).
- **University Summons Module:** Fines issuance by Student Affairs (HEP), online payment workflow, proof of transaction, and automated receipt generation.
- **Centralized Notification Engine:** In-app real-time notifications and asynchronous email triggers for key events.
- **Multi-Role Dashboards:** Customized visual analytics dashboards tailored to Students, Committee Members, and Administrators.

### 4.2 Out-of-Scope (Future Iterations / Phase 2)
- Native mobile applications (iOS/Android) — Phase 1 focuses on a fully responsive Web SPA.
- Live WebRTC Voice/Video channels (architectural hooks provided; feature deferred).
- Direct integration with commercial payment gateways (Phase 1 uses a mock payment gateway service with realistic transaction states).

---

## 5. Stakeholder Analysis

| Stakeholder Persona | Role & Interests | Key Needs & Pain Points |
| :--- | :--- | :--- |
| **Student** | Primary end-user | Seeks a single interface for events, social interaction, interest groups, and administrative tasks. |
| **Club Committee** | Event organizer & content creator | Requires tools to manage club members, publish official announcements, track event registrations, and upload photo galleries. |
| **Student Affairs (HEP)** | Administrative & enforcement body | Needs efficient fine/summons issuance, status tracking, payment verification, and campus oversight. |
| **System Administrator** | Platform operator | Requires user management, RBAC configuration, audit logging, system health analytics, and content moderation capabilities. |

---

## 6. Risk Register & Mitigation Strategies

| Risk Description | Severity | Probability | Risk Mitigation Strategy |
| :--- | :---: | :---: | :--- |
| **High Traffic Spikes During Popular Event Releases** | High | Medium | Implement AWS RDS Read Replicas, Redis caching for event availability queries, and rate-limiting on registration endpoints. |
| **Unauthenticated / Unauthorized Data Access via API** | High | Low | Enforce strict API policies using Laravel Gate/Policy classes, middleware check on every endpoint, and Sanctum token validation. |
| **Real-Time Chat Bottlenecks** | Medium | Medium | Decouple chat broadcasting from primary database transactions using asynchronous event queues (Laravel Queues + Redis) and WebSockets. |
| **File Storage Cost & Security (S3)** | Low | Medium | Enforce strict client/server file size/MIME validation, generate short-lived AWS S3 Presigned URLs for media access, and compress images on upload. |

---

## 7. Success Criteria

1. **Functional Completeness:** 100% execution of defined functional requirements across all 10 core modules.
2. **Architectural Cleanliness:** Strict adherence to MVC/Services-Repository pattern in Laravel, and Modular Component/Services architecture in Angular.
3. **Automated Test Coverage:** Minimum 80% code coverage on critical backend business logic (Unit/Integration tests).
4. **Production Deployment:** Fully automated CI/CD deployment pipeline deploying to an AWS EC2 + RDS + S3 environment behind an Nginx reverse proxy.