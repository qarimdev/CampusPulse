# REST API Specification Document: CampusPulse

**Document ID:** CP-DOC-007  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead Backend Engineer & API Architect  
**Project:** CampusPulse Enterprise Campus Platform  

---

## 1. API Overview & Design Principles

### Base URL & Versioning
All API endpoints are versioned and exposed over HTTPS:
* **Production Base URL:** `https://api.campuspulse.university.edu/api/v1`
* **Staging Base URL:** `https://staging-api.campuspulse.university.edu/api/v1`

### Authentication & Authorization
* **Scheme:** Bearer Token via Laravel Sanctum.
* **Header Format:** `Authorization: Bearer <sanctum_api_token>`
* **Role Enforcement:** Middleware validates token claims (`role: student|committee|hep|admin`).

---

## 2. Standardized API Response Envelopes

To maintain consistency across all endpoints, CampusPulse uses a standardized JSON response format.

### Success Response Envelope (HTTP 200/201)
```json
{
  "success": true,
  "message": "Operation executed successfully.",
  "data": {},
  "meta": {
    "timestamp": "2026-07-23T17:38:00Z"
  }
}