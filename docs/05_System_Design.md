# System Design & Technical Architecture: CampusPulse

**Document ID:** CP-DOC-05  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Principal Software Architect  
**Project:** CampusPulse Enterprise Campus Platform  

---

## 1. High-Level System Architecture

CampusPulse uses a modern, decoupled client-server architecture:

### Architectural Layering & Principles
1. **Single Page Application (SPA) Presentation:** Angular handles routing, state management, form validations, and user view renders entirely client-side.
2. **Stateless RESTful Application API:** Laravel provides a stateless REST API layer secured by Laravel Sanctum token validation.
3. **Services-Repository Pattern:** Controllers remain lightweight (`Thin Controllers, Fat Services`). Business logic is encapsulated inside dedicated `Services`, while database access logic is managed through `Repositories`.
4. **Asynchronous Execution:** Heavy, non-blocking tasks (email dispatches, PDF receipt generation, push notifications) are offloaded to Laravel Queues backed by Redis.

---

## 2. Core Architectural Patterns & Security Controls

### 2.1 Backend Design Patterns
- **Repository Pattern:** Decouples Eloquent ORM queries from business logic. Enables mock testing without live database interactions.
- **Factory Pattern:** Dynamically instantiates notification drivers (Email, In-App, WebSocket) and PDF generators based on payload configurations.
- **Observer Pattern:** Triggers event listeners automatically when Eloquent models mutate (e.g., updating denormalized post counts upon creating a new comment).

### 2.2 Security Architecture
- **Token-Based Authentication:** API routes enforce `auth:sanctum` middleware. Requests require a Bearer token in the `Authorization` HTTP header.
- **Role & Policy Middleware:** Granular permissions are validated via Laravel Gate and Policy classes (`UserPolicy`, `EventPolicy`, `SummonPolicy`).
- **Data Protection:** Form requests execute strict validation and string sanitization. Sensitive data is encrypted at rest (AES-256) and in transit (TLS 1.3).

---

## 3. Class Diagram (Core Domain Model)

---

## 4. Sequence Diagrams (Key System Workflows)

### 4.1 Event Registration with Capacity Locking Workflow

This sequence diagram illustrates real-time event booking, atomic concurrency checks, seat reservation, and QR ticket issuance:

### 4.2 Summons Settlement & PDF Receipt Generation Workflow

---

## 5. Deployment Architecture (AWS Cloud Infrastructure)

CampusPulse is deployed on AWS in a highly available, secure infrastructure topology:

### Deployment Infrastructure Specifications
- **CDN & DNS:** AWS Route 53 routes domain traffic to AWS CloudFront for global static asset caching.
- **Load Balancer:** AWS Application Load Balancer (ALB) terminates SSL/TLS and distributes incoming HTTP traffic evenly across EC2 instances.
- **Compute Layer:** Amazon EC2 instances running Ubuntu 24.04 LTS, Nginx reverse proxy, and PHP 8.2 FPM.
- **Data Persistence:** Amazon RDS MySQL 8.0 running in Multi-AZ deployment for automatic failover protection.
- **Object Storage:** Amazon S3 bucket configured with strict IAM policies and presigned URLs for media files.