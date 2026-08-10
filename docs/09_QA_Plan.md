# Testing & Quality Assurance Plan: CampusPulse

**Document ID:** CP-DOC-09  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** QA Lead & DevOps Engineer  
**Project:** CampusPulse Enterprise Campus Platform  

---

## 1. Testing Strategy Overview & Coverage Targets

CampusPulse follows the **Testing Pyramid** methodology to ensure reliability across all platform tiers:

              / \
             /   \       E2E Tests (Cypress)
            / E2E \      - 10% Coverage
           /-------\     - Critical User Journeys
          / Integ-  \    Integration / API Tests (PHPUnit)
         /  ration   \   - 30% Coverage
        /-------------\  - Controller, Middleware & Database
       /     Unit      \ Unit Tests (PHPUnit & Jest)
      /  Test Suite     \- 60% Coverage
     /-------------------\- Services, Helpers, UI Components

### Coverage Benchmarks
- **Line Coverage Target:** $\ge 85\%$ overall codebase coverage.
- **Critical Business Paths:** $100\%$ path coverage (Auth, Event Concurrency Lock, Payment Gateway Integration).

---

## 2. Unit & Integration Testing Framework

### 2.1 Backend Testing (Laravel & PHPUnit)
- **Framework:** PHPUnit / Pest PHP.
- **Database Isolation:** Database migration and refresh traits (`RefreshDatabase`) run against an in-memory SQLite database for maximum test speed.
- **Mocking:** External service providers (AWS S3, Payment Gateways, Mailers) are mocked using Laravel Facade Mocks (`Storage::fake()`, `Mail::fake()`).

#### Core Test Suites:
1. `AuthTest`: Tests registration validation, `@student.university.edu` domain enforcement, password hashing, and token issuance.
2. `EventConcurrencyTest`: Simulates parallel booking requests against `EventBookingService` to verify atomic `SELECT FOR UPDATE` locking.
3. `SummonPaymentTest`: Validates state transition from `unpaid` to `paid` upon receiving signed webhook payloads.

### 2.2 Frontend Unit Testing (Angular & Jest)
- **Framework:** Jest & Angular Testing Library.
- **Focus:** Component rendering, RxJS state management, HTTP interceptor token attachment, and form validation controls.

---

## 3. End-to-End (E2E) Automation (Cypress)

Cypress automates critical user workflows in headless browser instances running against staging environments.

### Key E2E Test Scenarios (Smoke & Regression Suite)
1. **Student Registration & Verification Flow:**
   - Navigates to `/auth/register` $\rightarrow$ Fills form $\rightarrow$ Asserts email trigger $\rightarrow$ Verifies redirect to dashboard.
2. **Event Seat Booking Flow:**
   - Logs in as Student $\rightarrow$ Browses `/events` $\rightarrow$ Selects event $\rightarrow$ Clicks "Register Now" $\rightarrow$ Asserts QR ticket rendering.
3. **Summons Payment & Receipt Flow:**
   - Logs in as Student $\rightarrow$ Views outstanding fine $\rightarrow$ Completes mock payment $\rightarrow$ Verifies PDF receipt download link generation.

---

## 4. Load & Performance Testing (k6)

Load testing evaluates platform stability under high concurrent student traffic (e.g., peak event registration periods).

### Performance Metrics & Thresholds
- **Target Concurrent Users:** 1,500 active virtual users (VUs).
- **Latency Threshold (95th percentile):** $p(95) < 300\text{ms}$ for read queries, $p(95) < 500\text{ms}$ for event registration writes.
- **Error Rate Threshold:** $< 0.1\%$ under normal load.

### k6 Test Script Plan
```js
// Configured virtual user ramp-up pattern
export const options = {
  stages: [
    { duration: '2m', target: 200 },  // Normal traffic
    { duration: '3m', target: 1500 }, // Peak registration spike
    { duration: '2m', target: 0 },    // Cool-down period
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  },
};