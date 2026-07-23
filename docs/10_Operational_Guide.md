# Operational & Maintenance Guide: CampusPulse

**Document ID:** CP-DOC-10  
**Version:** 1.0.0  
**Status:** Approved  
**Author:** Lead DevOps & Systems Engineer  
**Project:** CampusPulse Enterprise Campus Platform  

---

## 1. Environment Configuration

CampusPulse relies on environment variables managed via secured secrets vaults (e.g., AWS Secrets Manager or GitHub Encrypted Secrets).

### 1.1 Required Production Environment Variables (`.env`)

```ini
# Application Configuration
APP_NAME="CampusPulse"
APP_ENV=production
APP_KEY=base64:GeneratedSecretKeyHere...
APP_DEBUG=false
APP_URL=[https://api.campuspulse.university.edu](https://api.campuspulse.university.edu)

# Database (AWS RDS MySQL)
DB_CONNECTION=mysql
DB_HOST=rds-primary.campuspulse.internal
DB_PORT=3306
DB_DATABASE=campuspulse_prod
DB_USERNAME=cp_app_user
DB_PASSWORD=SecureProductionPassword123!

# Redis Cache & Queue
REDIS_HOST=cache.campuspulse.internal
REDIS_PASSWORD=SecureRedisPassword123!
REDIS_PORT=6379
QUEUE_CONNECTION=redis
CACHE_DRIVER=redis

# AWS S3 Storage
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=campuspulse-media-production

# Authentication & Security
SANCTUM_STATEFUL_DOMAINS=campuspulse.university.edu
SESSION_SECURE_COOKIE=true