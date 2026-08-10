# UI/UX Specification & Navigation Design: CampusPulse

**Document ID:** CP-DOC-08  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead UI/UX Architect & Angular Lead  
**Project:** CampusPulse Enterprise Campus Platform  

---

## 1. Design System Tokens & Aesthetic Philosophy

CampusPulse utilizes a modern, clean, and accessible design system built with CSS custom properties and Angular Material components.

### 1.1 Color Tokens
- **Primary Accent:** `#1E3A8A` (Deep Navy — trust, authority, institutional clarity)
- **Secondary Accent:** `#0EA5E9` (Vibrant Sky Blue — interactive elements, buttons, active states)
- **Success Signal:** `#10B981` (Emerald Green — verified payments, confirmed registrations)
- **Warning / Alert:** `#F59E0B` (Amber — pending summons, seat capacity thresholds)
- **Error / Urgent:** `#EF4444` (Crimson — overdue citations, validation errors)
- **Background (Light):** `#F8FAFC` (Slate 50 — clean, low-eyestrain layout canvas)
- **Surface Elevation:** `#FFFFFF` (Pure White — elevated card modules, modals)

### 1.2 Layout & Typography
- **Font Family:** `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Grid Layout:** 12-column fluid grid system with breakpoints for Desktop (`>=1024px`), Tablet (`768px - 1023px`), and Mobile (`<768px`).

---

## 2. Global Navigation Architecture

The interface uses a responsive **App Shell Layout**:
- **Desktop:** Persistent Left Sidebar Navigation + Top Context Header.
- **Mobile / Tablet:** Top Context Header + Collapsible Drawer Navigation + Bottom Action Dock.

---

## 3. Angular Routing & Component Structure

---

## 4. Key Screen Wireframe Specifications

### 4.1 Home Feed & Activity Stream (`/feed`)
- **Header Zone:** Quick Post Creator card ("What's happening on campus?").
- **Stream Zone:** Infinite-scroll list of post cards (`PostCardComponent`).
- **Post Card Elements:** Author avatar, timestamp, badge (Student/Club/HEP), rich content text, attached image lightbox, like/comment counts.
- **Sidebar Widget (Right):** Upcoming registered events widget and quick link to unpaid summons.

### 4.2 Event Detail & Registration Screen (`/events/:id`)
- **Hero Banner:** Event image thumbnail, category tag, and date badge.
- **Info Grid:** Location, host club, current available seats progress bar (`85 / 100 Seats Claimed`).
- **Action Module:**
  - If seats available: Primary CTA button **"Register Now"**.
  - If full: Secondary CTA button **"Join Waitlist"**.
- **Ticket Modal:** Displays dynamic QR ticket preview upon registration success.

### 4.3 Summons & Fine Payment Portal (`/summons`)
- **Summary Cards:** Total Outstanding Fines ($), Count of Active Violations.
- **Data Table:** Date, Citation Code, Violation Type, Fine Amount ($), Status (`Unpaid` / `Paid`), Action (`Pay Now` / `Download Receipt`).
- **Payment Modal:** FPX / Card gateway integration wrapper with real-time receipt preview.

---

## 5. Responsive Behavior & Accessibility

- **Mobile Viewport Adaptation:** Data tables convert to stackable card lists on viewports under `768px`.
- **Accessibility Standards:** Compliant with **WCAG 2.1 Level AA** standards:
  - Minimum contrast ratio of 4.5:1 for all body text.
  - Full keyboard accessibility for modals and navigation drawers.
  - Screen-reader labels (`aria-label`) on all interactive buttons and image attachments.