# HumanTee — Full-Stack E-Commerce Platform

> A production-grade, full-stack e-commerce platform for a custom T-shirt brand.
> Built with NestJS, Next.js 16, PostgreSQL, Redis, and Razorpay.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Services & Ports](#services--ports)
- [Features](#features)
  - [Customer Storefront](#customer-storefront)
  - [Admin Panel](#admin-panel)
  - [Backend API](#backend-api)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Start Infrastructure (Docker)](#2-start-infrastructure-docker)
  - [3. Backend Setup](#3-backend-setup)
  - [4. Admin Panel Setup](#4-admin-panel-setup)
  - [5. Customer Storefront Setup](#5-customer-storefront-setup)
- [Environment Variables](#environment-variables)
  - [Backend](#backend-backend-nodeenv)
  - [Admin Panel](#admin-panel-frontend-adminenvlocal)
  - [Customer Store](#customer-store-frontend-storeenvlocal)
- [Database Migrations](#database-migrations)
- [API Overview](#api-overview)
- [Security](#security)
- [Observability](#observability)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

HumanTee is a monorepo containing three independently deployable services:

| Service | Description | Port |
|---|---|---|
| `backend-node` | NestJS REST API | `3001` |
| `frontend-store` | Next.js customer storefront | `3000` |
| `frontend-admin` | Next.js admin dashboard | `3002` |

The platform supports the full e-commerce lifecycle — product browsing, cart, checkout with Razorpay, order tracking, discount codes, support tickets, and a full-featured admin panel with analytics, RBAC, and audit logs.

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                         Clients                          │
│  ┌───────────────────────┐  ┌────────────────────────┐   │
│  │  Customer Storefront  │  │    Admin Dashboard     │   │
│  │  Next.js 16 (: 3000)  │  │  Next.js 16 (: 3002)  │   │
│  └──────────┬────────────┘  └──────────┬─────────────┘   │
└─────────────┼─────────────────────────┼────────────────┘
              │         REST API         │
              ▼                          ▼
┌──────────────────────────────────────────────────────────┐
│              NestJS Backend API  (: 3001)                │
│  Auth · Products · Orders · Payments · Shipping          │
│  Discounts · Tickets · Analytics · Notifications         │
│  Audit Logs · RBAC · Settings · Webhooks                 │
└──────────┬────────────────────────────┬──────────────────┘
           │                            │
     ┌─────▼──────┐             ┌───────▼──────┐
     │ PostgreSQL │             │    Redis      │
     │  (: 5432)  │             │   (: 6379)   │
     └────────────┘             └──────────────┘
```

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| NestJS 11 | Server framework (modular, DI-driven) |
| TypeORM | ORM + database migrations |
| PostgreSQL 15 | Primary relational database |
| Redis 7 | Caching, rate-limit counters |
| Passport.js + JWT | Auth (access + refresh token strategy) |
| Google OAuth 2.0 | Social login |
| Razorpay | Payment gateway + webhook handling |
| Cloudinary | Image upload & CDN delivery |
| Nodemailer + Brevo | Transactional email (OTP, order confirmations) |
| Handlebars | Email templating |
| Helmet | HTTP security headers |
| Sentry | Error tracking & performance monitoring |
| prom-client | Prometheus metrics exposure |

### Frontend (Storefront & Admin)

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework with SSR/SSG |
| React 19 | UI rendering |
| TailwindCSS v4 | Utility-first styling |
| TanStack Query v5 | Server state management & caching |
| Zustand | Client-side state management |
| Framer Motion | Animations & transitions |
| Recharts | Admin analytics charts |
| Lottie React | Animation assets (storefront) |
| Three.js | 3D product visualization |
| React Hook Form + Zod | Form handling & validation |
| next-intl | Internationalization (admin) |
| Sentry | Frontend error tracking |
| jsPDF | PDF invoice generation |

---

## Project Structure

```
HumanTee/
├── backend-node/               # NestJS REST API
│   ├── src/
│   │   ├── analytics/          # Sales & traffic analytics
│   │   ├── audit/              # Admin audit log records
│   │   ├── auth/               # JWT, Google OAuth, OTP login
│   │   ├── cart/               # Cart management
│   │   ├── common/             # Guards, interceptors, middleware, pipes
│   │   ├── contact/            # Public contact form
│   │   ├── delhivery/          # Delhivery courier integration
│   │   ├── discounts/          # Coupon & discount engine
│   │   ├── email/              # Nodemailer + Brevo email service
│   │   ├── entities/           # Shared TypeORM entities
│   │   ├── health/             # /health endpoint
│   │   ├── jobs/               # Scheduled background jobs
│   │   ├── notifications/      # Push/email notifications
│   │   ├── orders/             # Order lifecycle management
│   │   ├── payments/           # Razorpay payment flows
│   │   ├── products/           # Product catalog & inventory
│   │   ├── rbac/               # Role-based access control
│   │   ├── redis/              # Redis client module
│   │   ├── settings/           # Site settings & maintenance mode
│   │   ├── shipping/           # Shipping rate & tracking
│   │   ├── tickets/            # Customer support tickets
│   │   └── webhooks/           # Razorpay webhook handlers
│   ├── migrations/             # TypeORM SQL migrations
│   └── .env.example            # Environment variable template
│
├── frontend-store/             # Customer-facing Next.js storefront
│   ├── app/
│   │   ├── account/            # User account & profile
│   │   ├── cart/               # Shopping cart page
│   │   ├── checkout/           # Checkout flow
│   │   ├── contact/            # Contact page
│   │   ├── login/              # Auth pages
│   │   ├── orders/             # Order history & tracking
│   │   ├── product/            # Product detail pages
│   │   ├── shop/               # Product listing / browsing
│   │   ├── shipping/           # Shipping info page
│   │   └── terms-privacy/      # Legal pages
│   ├── .env.local.example      # Environment variable template
│   └── vercel.json             # Vercel deployment config
│
├── frontend-admin/             # Admin dashboard Next.js app
│   ├── app/admin/
│   │   ├── analytics/          # Sales dashboards & charts
│   │   ├── audit-logs/         # Admin action history
│   │   ├── customers/          # Customer management
│   │   ├── discounts/          # Coupon management
│   │   ├── orders/             # Order management
│   │   ├── products/           # Product & inventory management
│   │   ├── settings/           # Site configuration
│   │   ├── system/             # System health & metrics
│   │   ├── team/               # Staff & role management
│   │   ├── tickets/            # Support ticket queue
│   │   └── user-logs/          # User activity logs
│   └── .env.local.example      # Environment variable template
│
└── docker-compose.yml          # PostgreSQL + Redis + Backend
```

---

## Services & Ports

| Service | URL | Description |
|---|---|---|
| Customer Storefront | http://localhost:3000 | Public-facing shop |
| Backend API | http://localhost:3001 | REST API |
| Admin Dashboard | http://localhost:3002 | Internal admin panel |
| PostgreSQL | localhost:5432 | Primary database |
| Redis | localhost:6379 | Cache / session store |
| Health Check | http://localhost:3001/health | API health endpoint |
| Prometheus Metrics | http://localhost:3001/metrics | Observability metrics |

---

## Features

### Customer Storefront

- **Product browsing** — catalog, filters, and detail pages with 3D product visualization (Three.js)
- **Cart & Checkout** — full cart lifecycle with Razorpay payment integration
- **Google OAuth + OTP login** — passwordless authentication options
- **Order tracking** — real-time order status updates
- **PDF Invoices** — downloadable invoices via jsPDF
- **Lottie animations** — polished loading and success states
- **Demo mode** — forces successful payment outcomes for client demos (`NEXT_PUBLIC_DEMO_MODE=true`)
- **Sitemap & robots.txt** — SEO-ready auto-generated files
- **Shopify Storefront API** — product data sourced from Shopify CDN

### Admin Panel

- **Dashboard** — KPIs, revenue charts (Recharts), recent orders at a glance
- **Order management** — view, filter, update order status, process refunds
- **Product management** — create/edit products, manage inventory
- **Customer management** — view customer profiles and order history
- **Discount engine** — create percentage/fixed coupon codes with expiry & usage limits
- **Support tickets** — view and respond to customer support tickets
- **Audit logs** — full trail of admin actions
- **User logs** — customer activity tracking
- **Team management** — invite staff, assign roles (RBAC)
- **Settings** — site-wide configuration, maintenance mode toggle
- **System health** — API health metrics, performance indicators
- **Internationalization** — multi-locale support via `next-intl`

### Backend API

- **Authentication** — JWT (access + refresh), Google OAuth, OTP-based email login
- **Rate limiting** — tiered throttling (100 req/min default, 5 req/min for orders)
- **RBAC** — role-based guards on all admin routes
- **Payments** — Razorpay order creation, webhook HMAC-SHA256 signature verification
- **Email** — Handlebars-templated emails via Nodemailer (dev) and Brevo (production)
- **Image uploads** — Cloudinary integration via Multer
- **Shipping** — Delhivery courier API integration
- **Background jobs** — scheduled tasks via `@nestjs/schedule`
- **Caching** — Redis-backed caching and Upstash Redis support
- **Compression** — gzip/brotli response compression (60-70% size reduction)
- **Security headers** — Helmet CSP, HSTS, X-Frame-Options, XSS protection
- **Graceful shutdown** — SIGTERM/SIGINT handling to drain connections cleanly

---

## Prerequisites

| Tool | Minimum Version |
|---|---|
| Node.js | 20.x |
| npm | 10.x |
| Docker + Docker Compose | Latest stable |
| PostgreSQL | 15 (or via Docker) |
| Redis | 7 (or via Docker) |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd HumanTee
```

### 2. Start Infrastructure (Docker)

Spin up PostgreSQL and Redis with one command:

```bash
docker-compose up -d postgres redis
```

Verify services are healthy:

```bash
docker-compose ps
```

### 3. Backend Setup

```bash
cd backend-node

# Copy and configure environment variables
cp .env.example .env

# Install dependencies
npm install

# Run database migrations
npm run migration:run

# Start development server
npm run start:dev
```

The API will be available at **http://localhost:3001**

### 4. Admin Panel Setup

```bash
cd frontend-admin

# Copy and configure environment variables
cp .env.local.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

The admin panel will be available at **http://localhost:3002**

### 5. Customer Storefront Setup

```bash
cd frontend-store

# Copy and configure environment variables
cp .env.local.example .env.local

# Install dependencies
npm install

# Start development server
npm run dev
```

The storefront will be available at **http://localhost:3000**

---

## Environment Variables

### Backend (`backend-node/.env`)

```env
# Server
PORT=3001
NODE_ENV=development

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password_here
DB_DATABASE=humantee

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3001/auth/google/callback

# Email (SMTP / Nodemailer - development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
SMTP_FROM=HumanTee <your-email@gmail.com>

# Email (Brevo - production)
BREVO_API_KEY=your-brevo-api-key
ADMIN_EMAIL=humanteeteam@gmail.com

# OTP
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=5

# CORS
CORS_ENABLED=true
CORS_ORIGINS=http://localhost:3000,http://localhost:3002
CORS_CREDENTIALS=true
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3002

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret

# Session
SESSION_SECRET=your-session-secret-min-32-chars
SESSION_MAX_AGE=604800000
```

### Admin Panel (`frontend-admin/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CUSTOMER_URL=http://localhost:3000
```

### Customer Store (`frontend-store/.env.local`)

```env
# Demo / Dev flags
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_SKIP_INTRO=false
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=myhumantee.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-token
NEXT_PUBLIC_SHOPIFY_ADMIN_ACCESS_TOKEN=your-admin-token
SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=your-customer-account-client-id
SHOPIFY_CUSTOMER_ACCOUNT_API_URL=https://account.humantee.in

# Session
SESSION_SECRET=your-secret-key-min-32-chars

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Database Migrations

All schema changes are managed via TypeORM migrations. Never use `synchronize: true` in production.

```bash
cd backend-node

# Run all pending migrations
npm run migration:run

# Revert the last applied migration
npm run migration:revert

# Generate a new migration from entity diff
npm run migration:generate -- src/migrations/MigrationName

# Create a blank migration file
npm run migration:create -- src/migrations/MigrationName
```

> **Note:** The production start script (`start:prod`) automatically runs migrations before starting the server: `npm run migration:run && node dist/main.js`

---

## API Overview

| Domain | Base Path | Description |
|---|---|---|
| Auth | `/auth` | Login, register, OAuth, OTP, token refresh |
| Products | `/products` | Product catalog, variants, inventory |
| Cart | `/cart` | Cart CRUD operations |
| Orders | `/orders` | Order placement & lifecycle |
| Payments | `/payments` | Razorpay order creation & verification |
| Shipping | `/shipping` | Shipping rates & tracking |
| Discounts | `/discounts` | Coupon validation & management |
| Tickets | `/tickets` | Customer support ticket system |
| Analytics | `/analytics` | Admin sales & traffic analytics |
| Notifications | `/notifications` | Push & email notifications |
| Settings | `/settings` | Site-wide settings |
| Webhooks | `/webhooks` | Razorpay payment webhooks |
| Health | `/health` | API health check |
| Metrics | `/metrics` | Prometheus metrics endpoint |

### Rate Limits

| Throttle Tier | Limit | Applied To |
|---|---|---|
| `default` | 100 req/min | All routes |
| `admin` | 30 req/min | Admin routes |
| `strict` | 10 req/min | Sensitive endpoints |
| `order` | 5 req/min | Order creation |
| `webhook` | 20 req/min | Webhook endpoints |

---

## Security

| Layer | Implementation |
|---|---|
| Authentication | JWT access tokens (15m TTL) + HttpOnly refresh tokens (7d TTL) |
| Authorization | Passport JWT + RBAC guards on all admin routes |
| Rate Limiting | NestJS Throttler — tiered per route sensitivity |
| Security Headers | Helmet — CSP, HSTS (1yr + preload), X-Frame-Options: DENY |
| Input Validation | `class-validator` + `ValidationPipe` (whitelist + forbidNonWhitelisted) |
| Webhook Verification | Raw body preserved for Razorpay HMAC-SHA256 signature check |
| Password Hashing | bcrypt |
| CORS | Environment-driven allowlist via `CORS_ORIGINS` |
| Sensitive Data Redaction | Cookies and Authorization headers stripped before Sentry reporting |

---

## Observability

| Tool | Purpose | Endpoint |
|---|---|---|
| Sentry | Error tracking & distributed tracing (10% sample rate) | External DSN |
| Prometheus | Application metrics | `GET /metrics` |
| Health Check | Database + Redis connectivity | `GET /health` |
| Request Logger | Per-request timing + DB query count | `logs/api-requests.log` |

To enable Sentry, set `SENTRY_DSN` in your environment. Without it, the app starts normally and logs a warning.

### HTTP Caching Strategy

| Route Pattern | Cache-Control |
|---|---|
| `/products*` | `public, max-age=300, stale-while-revalidate=600` |
| `/settings*`, `/homepage*` | `public, max-age=3600, stale-while-revalidate=7200` |
| `/admin*` | `no-cache, no-store, must-revalidate` |
| All others | `public, max-age=120, stale-while-revalidate=240` |

---

## Deployment

### Full Stack via Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View backend logs
docker-compose logs -f backend

# Stop all services
docker-compose down
```

### Frontend (Vercel)

Both Next.js apps can be deployed independently to Vercel.

1. Connect the repository to a Vercel project.
2. Set the **Root Directory** to `frontend-store` or `frontend-admin`.
3. Configure all required environment variables in the Vercel dashboard.
4. Deploy. The `frontend-store` includes a `vercel.json` with pre-configured routing rules.

### Backend (Render / Railway / Docker)

```bash
# Production build
npm run build

# Start with automatic migration
npm run start:prod
```

For Neon (serverless PostgreSQL), set `DATABASE_URL` instead of individual `DB_*` variables — the backend auto-detects and uses it.

---

## License

This project is **UNLICENSED** — all rights reserved. See [LICENSE](./LICENSE) for details.

---

*Built by the HumanTee engineering team.*
