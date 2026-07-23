# Database Design & Schema Specification: CampusPulse

**Document ID:** CP-DOC-006  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Principal Database Architect & Technical Lead  
**Engine:** MySQL 8.0+ (InnoDB Engine, `utf8mb4_unicode_ci` Collation)  

---

## 1. Architectural Strategy & Conventions

CampusPulse uses a relational database model in MySQL 8.0. To optimize query throughput and ensure transactional integrity across multi-user concurrent operations, the schema adheres to strict relational standards:

1. **Primary Keys:** Every table uses auto-incrementing unsigned big integers (`BIGINT UNSIGNED AUTO_INCREMENT`) aliased as `id`.
2. **Foreign Key Integrity:** Cascading deletes (`ON DELETE CASCADE`) are applied to child entity relationships (e.g., comments, likes, event bookings). Critical administrative entities (e.g., summons, payment transactions) use `ON DELETE RESTRICT` to enforce auditability.
3. **Indexing Strategy:** Composite indexes are placed on high-cardinality multi-column filter queries (e.g., `[club_id, status]`, `[community_id, created_at]`). Full-text indexes are configured for post and discussion searches.
4. **Timestamps & Auditing:** Standard Laravel timestamps (`created_at`, `updated_at`) are maintained on all tables. Destructive user operations on core entities employ soft deletes (`deleted_at TIMESTAMP NULL`).

---

## 2. Entity-Relationship Diagram (Textual Representation)

---

## 3. Detailed Data Dictionary

### Module 1: Core Authentication & Users

#### 3.1 `users` Table
Stores authentication identity, global application role, and account status.

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `name` | `VARCHAR(255)` | `NOT NULL` | Full legal name |
| `email` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | University email address |
| `email_verified_at` | `TIMESTAMP` | `NULL` | Timestamp of email verification |
| `password` | `VARCHAR(255)` | `NOT NULL` | Bcrypt hashed password |
| `role` | `ENUM` | `'student','committee','hep','admin'` | Default: `'student'` |
| `status` | `ENUM` | `'active','suspended','pending'` | Default: `'active'` |
| `remember_token` | `VARCHAR(100)` | `NULL` | Session persist token |
| `created_at` | `TIMESTAMP` | `NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Update timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `UNIQUE INDEX idx_users_email (email)`, `INDEX idx_users_role_status (role, status)`

#### 3.2 `personal_access_tokens` Table (Sanctum Tokens)
Used by Laravel Sanctum for API bearer token verification.

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `tokenable_type` | `VARCHAR(255)` | `NOT NULL` | Morphic model class name |
| `tokenable_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Polymorphic User ID |
| `name` | `VARCHAR(255)` | `NOT NULL` | Token identifier label |
| `token` | `VARCHAR(64)` | `NOT NULL, UNIQUE` | Hashed token value |
| `abilities` | `TEXT` | `NULL` | JSON granular permission array |
| `last_used_at` | `TIMESTAMP` | `NULL` | Timestamp of last API hit |
| `expires_at` | `TIMESTAMP` | `NULL` | Token expiration timestamp |
| `created_at` | `TIMESTAMP` | `NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Update timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `UNIQUE INDEX idx_pat_token (token)`, `INDEX idx_pat_tokenable (tokenable_type, tokenable_id)`

---

### Module 2: Student Profiles

#### 3.3 `student_profiles` Table
Stores extended academic and personal bio details for students.

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `user_id` | `BIGINT` | `UNSIGNED, NOT NULL, UNIQUE` | Foreign Key -> `users(id) ON DELETE CASCADE` |
| `student_matrix_id`| `VARCHAR(50)` | `NOT NULL, UNIQUE` | University ID card number |
| `faculty` | `VARCHAR(150)` | `NOT NULL` | Faculty (e.g., Computing, Engineering) |
| `programme` | `VARCHAR(150)` | `NOT NULL` | Degree program name |
| `academic_year` | `TINYINT` | `UNSIGNED, NOT NULL` | Academic year (1, 2, 3, 4) |
| `avatar_url` | `VARCHAR(500)` | `NULL` | AWS S3 key/URL for avatar |
| `bio` | `TEXT` | `NULL` | Short student introduction |
| `interests` | `JSON` | `NULL` | Array of interest tags |
| `created_at` | `TIMESTAMP` | `NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Update timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `FOREIGN KEY (user_id)`, `UNIQUE INDEX idx_matrix_id (student_matrix_id)`

---

### Module 3: Clubs & Committee Management

#### 3.4 `clubs` Table
Official university clubs with assigned committee leaders.

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `name` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Club name |
| `slug` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | URL-friendly slug |
| `description` | `TEXT` | `NOT NULL` | Club mandate & overview |
| `logo_url` | `VARCHAR(500)` | `NULL` | AWS S3 image key |
| `banner_url` | `VARCHAR(500)` | `NULL` | AWS S3 banner key |
| `category` | `VARCHAR(100)` | `NOT NULL` | Category tag (e.g., Academic, Cultural) |
| `status` | `ENUM` | `'active','inactive'` | Default: `'active'` |
| `created_at` | `TIMESTAMP` | `NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Update timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `UNIQUE INDEX idx_clubs_slug (slug)`, `INDEX idx_clubs_category (category)`

#### 3.5 `club_members` Table
Pivotal membership directory mapping users to clubs with role designations.

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `club_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `clubs(id) ON DELETE CASCADE` |
| `user_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `users(id) ON DELETE CASCADE` |
| `club_role` | `ENUM` | `'member','committee_lead','committee_member'` | Default: `'member'` |
| `status` | `ENUM` | `'pending','approved','rejected'` | Default: `'pending'` |
| `joined_at` | `TIMESTAMP` | `NULL` | Approval timestamp |
| `created_at` | `TIMESTAMP` | `NULL` | Application creation timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Update timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `UNIQUE INDEX idx_club_user_unique (club_id, user_id)`, `INDEX idx_club_status (club_id, status)`

#### 3.6 `club_announcements` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `club_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `clubs(id) ON DELETE CASCADE` |
| `author_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `users(id) ON DELETE CASCADE` |
| `title` | `VARCHAR(255)` | `NOT NULL` | Announcement title |
| `content` | `TEXT` | `NOT NULL` | Announcement body text |
| `is_pinned` | `BOOLEAN` | `DEFAULT FALSE` | Top-pin status flag |
| `created_at` | `TIMESTAMP` | `NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Update timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `INDEX idx_club_pinned (club_id, is_pinned)`

---

### Module 4: Communities

#### 3.7 `communities` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `name` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Community group title |
| `slug` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | URL-friendly slug |
| `category` | `ENUM` | `'sports','technology','lifestyle'` | Category grouping |
| `description` | `TEXT` | `NOT NULL` | Group topic and guidelines |
| `icon_url` | `VARCHAR(500)` | `NULL` | Community logo |
| `created_at` | `TIMESTAMP` | `NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Update timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `UNIQUE INDEX idx_comm_slug (slug)`, `INDEX idx_comm_category (category)`

#### 3.8 `community_members` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `community_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `communities(id) ON DELETE CASCADE` |
| `user_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `users(id) ON DELETE CASCADE` |
| `created_at` | `TIMESTAMP` | `NULL` | Join timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `UNIQUE INDEX idx_comm_user (community_id, user_id)`

---

### Module 5: Events Lifecycle Engine

#### 3.9 `events` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `organizer_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `clubs(id) ON DELETE CASCADE` |
| `created_by` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `users(id) ON DELETE CASCADE` |
| `title` | `VARCHAR(255)` | `NOT NULL` | Event headline |
| `slug` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | URL slug |
| `description` | `TEXT` | `NOT NULL` | Detailed description |
| `poster_url` | `VARCHAR(500)` | `NULL` | Poster image S3 link |
| `venue` | `VARCHAR(255)` | `NOT NULL` | Physical venue / Hall |
| `max_participants` | `INT` | `UNSIGNED, NOT NULL` | Hard ticket/seat limit |
| `registration_deadline`| `DATETIME` | `NOT NULL` | Expiration datetime |
| `start_time` | `DATETIME` | `NOT NULL` | Event start datetime |
| `end_time` | `DATETIME` | `NOT NULL` | Event end datetime |
| `status` | `ENUM` | `'draft','published','cancelled','completed'` | Default: `'published'` |
| `created_at` | `TIMESTAMP` | `NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Update timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `UNIQUE INDEX idx_events_slug (slug)`, `INDEX idx_events_timeline (start_time, status)`

#### 3.10 `event_registrations` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `event_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `events(id) ON DELETE CASCADE` |
| `user_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `users(id) ON DELETE CASCADE` |
| `ticket_qr_code` | `VARCHAR(255)` | `NOT NULL, UNIQUE` | Unique Hash String for QR Ticket |
| `status` | `ENUM` | `'confirmed','waitlisted','attended','cancelled'` | Default: `'confirmed'` |
| `registered_at` | `TIMESTAMP` | `NOT NULL` | Registration timestamp |
| `created_at` | `TIMESTAMP` | `NULL` | Record creation |
| `updated_at` | `TIMESTAMP` | `NULL` | Record update |

- **Indexes:** `PRIMARY KEY (id)`, `UNIQUE INDEX idx_event_user (event_id, user_id)`, `INDEX idx_qr_code (ticket_qr_code)`

---

### Module 6: Campus Social Feed

#### 3.11 `posts` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `user_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `users(id) ON DELETE CASCADE` |
| `content` | `TEXT` | `NOT NULL` | Post text body |
| `media_urls` | `JSON` | `NULL` | Array of S3 attachment URLs |
| `likes_count` | `INT` | `UNSIGNED, DEFAULT 0` | Denormalized like counter |
| `comments_count` | `INT` | `UNSIGNED, DEFAULT 0` | Denormalized comment counter |
| `status` | `ENUM` | `'visible','flagged','removed'` | Default: `'visible'` |
| `created_at` | `TIMESTAMP` | `NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Update timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `INDEX idx_posts_user_timeline (user_id, created_at DESC)`, `FULLTEXT idx_post_content (content)`

#### 3.12 `post_comments` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `post_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `posts(id) ON DELETE CASCADE` |
| `user_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `users(id) ON DELETE CASCADE` |
| `parent_id` | `BIGINT` | `UNSIGNED, NULL` | Self-reference -> `post_comments(id) ON DELETE CASCADE` (for nested comments) |
| `comment_text` | `TEXT` | `NOT NULL` | Comment content |
| `created_at` | `TIMESTAMP` | `NULL` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Update timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `INDEX idx_comments_post (post_id, created_at ASC)`

#### 3.13 `post_likes` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `post_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `posts(id) ON DELETE CASCADE` |
| `user_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `users(id) ON DELETE CASCADE` |
| `created_at` | `TIMESTAMP` | `NULL` | Like timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `UNIQUE INDEX idx_like_unique (post_id, user_id)`

---

### Module 7: Real-Time Community Chat

#### 3.14 `chat_messages` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `community_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `communities(id) ON DELETE CASCADE` |
| `sender_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `users(id) ON DELETE CASCADE` |
| `message` | `TEXT` | `NULL` | Chat text body |
| `media_url` | `VARCHAR(500)` | `NULL` | Shared photo/attachment URL |
| `reply_to_id` | `BIGINT` | `UNSIGNED, NULL` | Self Foreign Key -> `chat_messages(id) ON DELETE SET NULL` |
| `created_at` | `TIMESTAMP` | `NULL` | Dispatch timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Update timestamp |

- **Indexes:** `PRIMARY KEY (id)`, `INDEX idx_chat_comm_time (community_id, created_at DESC)`

---

### Module 8: University Summons & Receipts

#### 3.15 `summons` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `summon_code` | `VARCHAR(50)` | `NOT NULL, UNIQUE` | Official citation code (e.g., `SUM-2026-00411`) |
| `student_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `users(id) ON DELETE RESTRICT` |
| `issued_by` | `BIGINT` | `UNSIGNED, NOT NULL` | Foreign Key -> `users(id) ON DELETE RESTRICT` (HEP Officer) |
| `violation_type` | `VARCHAR(150)` | `NOT NULL` | Violation category (e.g., Illegal Parking, Noise) |
| `location` | `VARCHAR(255)` | `NOT NULL` | Incident location |
| `amount` | `DECIMAL(8,2)` | `UNSIGNED, NOT NULL` | Fine amount in local currency (MYR) |
| `due_date` | `DATE` | `NOT NULL` | Payment deadline date |
| `status` | `ENUM` | `'unpaid','paid','appealed','waived'` | Default: `'unpaid'` |
| `created_at` | `TIMESTAMP` | `NULL` | Citation date |
| `updated_at` | `TIMESTAMP` | `NULL` | Record status update date |

- **Indexes:** `PRIMARY KEY (id)`, `UNIQUE INDEX idx_summon_code (summon_code)`, `INDEX idx_student_summons (student_id, status)`

#### 3.16 `summon_receipts` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `BIGINT` | `UNSIGNED, AUTO_INCREMENT` | Primary Key |
| `summon_id` | `BIGINT` | `UNSIGNED, NOT NULL, UNIQUE` | Foreign Key -> `summons(id) ON DELETE RESTRICT` |
| `receipt_number` | `VARCHAR(100)` | `NOT NULL, UNIQUE` | Unique receipt identifier |
| `transaction_reference`| `VARCHAR(100)` | `NOT NULL, UNIQUE` | Payment Gateway Transaction Token |
| `amount_paid` | `DECIMAL(8,2)` | `UNSIGNED, NOT NULL` | Settled amount |
| `payment_method` | `VARCHAR(50)` | `NOT NULL` | Payment channel (e.g., Credit Card, FPX) |
| `receipt_pdf_url` | `VARCHAR(500)` | `NOT NULL` | AWS S3 key for signed PDF receipt |
| `paid_at` | `TIMESTAMP` | `NOT NULL` | Settlement timestamp |
| `created_at` | `TIMESTAMP` | `NULL` | Record creation |
| `updated_at` | `TIMESTAMP` | `NULL` | Record update |

- **Indexes:** `PRIMARY KEY (id)`, `UNIQUE INDEX idx_receipt_num (receipt_number)`, `FOREIGN KEY (summon_id)`

---

### Module 9: Notifications Engine

#### 3.17 `notifications` Table

| Column Name | Data Type | Attributes | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `CHAR(36)` | `NOT NULL` | Primary Key (UUID v4) |
| `type` | `VARCHAR(255)` | `NOT NULL` | Notification event class |
| `notifiable_type` | `VARCHAR(255)` | `NOT NULL` | Morphic entity (User) |
| `notifiable_id` | `BIGINT` | `UNSIGNED, NOT NULL` | Recipient User ID |
| `data` | `JSON` | `NOT NULL` | Notification payload (title, action_url, message) |
| `read_at` | `TIMESTAMP` | `NULL` | Read status timestamp |
| `created_at` | `TIMESTAMP` | `NULL` | Emission timestamp |
| `updated_at` | `TIMESTAMP` | `NULL` | Record update |

- **Indexes:** `PRIMARY KEY (id)`, `INDEX idx_notif_read (notifiable_type, notifiable_id, read_at)`

---

## 4. Migration Execution Plan

To preserve foreign key constraint dependencies, Laravel migrations must run in strict sequential order: