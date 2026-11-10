# DHANU — Personal Growth & Consistency Platform

> **"Don't just plan your growth. Prove it through your daily actions."**

DHANU is an end-to-end, production-grade personal growth and daily accountability platform built to transform personal goals into measurable daily actions. Unlike ordinary to-do lists that encourage passive check-boxing, DHANU requires verifiable photographic proof, reflection on learnings, independent activity streaks, and intelligent 4-hour inactivity monitoring.

---

## 🏛 Platform Architecture & Tech Stack

- **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide Icons, Recharts, Framer Motion, Canvas Confetti.
- **Backend**: Next.js REST API Architecture with server-side validation, JWT authentication (`jsonwebtoken`), and bcrypt password hashing (`bcryptjs`).
- **Database**: SQLite / PostgreSQL with Prisma ORM (`@prisma/client`), complete with foreign keys, cascading deletions, and compound unique constraints.
- **Mobile Experience**: Progressive Web App (PWA) with `manifest.json`, Service Worker offline caching, background sync, and Web Push notifications (`web-push`).
- **Brand Identity**: Deep navy / charcoal palette (`#0B1220`), electric blue and cyan accents, geometric Dhanu logo representing precision trajectory and unbroken momentum.

---

## ⚡ Core Features

### 1. Initial Onboarding Routine Setup
When new users register, they are immediately guided through the multi-step routine builder:
- Add unlimited daily activities with target durations and preferred execution times.
- Configure active days (Mon–Sun) and designated rest days. Rest days protect activity streaks from resetting.
- Set an anchor 90-day goal (e.g. "Solve 300 DSA Problems") before launching the personalized dashboard.

### 2. Daily Activity Tracking & Photographic Evidence
- Each activity supports interactive states: `Not Started`, `In Progress`, `Completed`, `Missed`, `Skipped`.
- **Live Activity Timer**: Start, pause, resume, and track exact duration in real time.
- **Mandatory Completion Submission**:
  - What did you accomplish?
  - What did you learn today?
  - What problems did you solve or friction did you overcome?
  - Actual time spent (minutes / hours).
  - Photographic proof upload (camera capture on mobile `capture="environment"`, gallery upload, instant preview, replacement, secure storage).
  - Only marked successful after verified submission is saved.

### 3. Dual-Streak Engine (LeetCode & GitHub Inspired)
- **Daily Login Streak**: Consecutive calendar days with successful login, current streak, longest streak, and total active days.
- **Activity Completion Streaks**: Each activity possesses its own independent streak counter. Completed scheduled sessions advance it; missed sessions reset it; rest days and paused activities protect it.
- **GitHub-style 365-Day Contribution Calendar**: Shaded by focus intensity levels (0 to 4) with interactive day inspection tooltips.
- **Milestone Badges**: Genuine achievements for 7, 14, 30, 60, and 100 days of unbroken consistency.

### 4. Smart Inactivity Reminders (4-Hour Window)
- Backend inactivity scheduler checks if 4 consecutive hours have passed since the user's `lastActiveAt` timestamp.
- Suppresses alerts during sleep quiet hours (default: 22:00 to 07:00).
- Dispatches Web Push notifications and in-app alert cards.
- Provides a one-click simulation test button to verify the inactivity delivery infrastructure on demand.

### 5. Learning Portfolio & Journal
- Searchable and filterable learning history (by keyword, activity, or date range).
- Lightbox modal for high-resolution inspection of photographic proof.
- Ability to edit permitted personal notes and export the complete journal to CSV.

### 6. Growth Analytics
- Deterministic metrics computed from verified database records.
- Daily consistency area chart, weekly volume bar chart, and time distribution pie chart.
- Period-over-period comparison (e.g., current 30 days vs previous 30 days with percentage change).
- Range filters: 7 days, 30 days, 90 days, 6 months, 1 year.

### 7. Missed Activity Recovery
- Non-judgmental accountability flow allowing users to log honest reasons for missed commitments and adjust target durations if friction was too high.

### 8. Data Sovereignty & Account Controls
- Download full account data as JSON.
- Download verified journal history as CSV.
- Permanent account deletion with database cascade.

---

## 📱 Mobile PWA Installation (Without App Stores)

DHANU is designed mobile-first and installs directly on Android and iOS:
- **Android / Chromium**: Automatically triggers the native browser installation banner and provides an "Install App" button.
- **iOS Safari**: Provides a step-by-step visual guide:
  1. Tap the Share button in Safari.
  2. Select **"Add to Home Screen"**.
  3. Launch DHANU in standalone fullscreen mode.
- Caches app shells and static assets via `public/sw.js` for offline readiness with fallback page `public/offline.html`.

---

## 🚀 Getting Started

### 1. Installation
\`\`\`bash
npm install
\`\`\`

### 2. Database Setup & Seeding
\`\`\`bash
# Initialize SQLite database dev.db with Prisma schema
npx prisma db push

# Seed demo user with historical 14-day streak and portfolio data
node scripts/seed.js
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit `http://localhost:3000` in your browser.

### 4. Demo Account Credentials
- **Email**: `alex@dhanu.growth`
- **Password**: `Dhanu2026!`
- Or click the **"Instant 1-Click Demo Login"** button on `/login`.

### 5. Run Automated Verification Test Suite
\`\`\`bash
node scripts/verify_platform.js
\`\`\`

### 6. Production Build
\`\`\`bash
npm run build
npm start
\`\`\`

---

## 📄 Application Pages (All 20 Implemented)

1. `/` — Landing Page & Philosophy Manifesto
2. `/signup` — Account Registration
3. `/login` — Account Sign In & Instant Demo Access
4. `/forgot-password` — Password Recovery & Reset Flow
5. `/onboarding` — Multi-Step Routine & Schedule Builder
6. `/dashboard` — Main Dashboard with Daily Routine Cards & Live Timer
7. `/routine` — Routine Management, Reordering, and Pause / Resume
8. `/activities/[id]` — Activity Deep Dive & Historical Proof Log
9. Completion Submission — Modal with Photo Capture & Confetti
10. `/journal` — Learning Portfolio, Search, and Lightbox Viewer
11. `/streaks` — Streak Dashboard & 365-Day Contribution Grid
12. `/analytics` — Growth Analytics & Period Comparisons (Recharts)
13. `/goals` — Long-Term Goal Tracking & Predictive Cadence
14. `/calendar` — Monthly Calendar with Date Inspector
15. `/reviews` — Weekly Review & Intelligence Summary
16. `/notifications` — Inactivity Alert Center & Push Simulator
17. `/profile` — User Profile, Sleep Schedule, & Daily Targets
18. `/settings` — Inactivity Thresholds, Quiet Hours, & Data Export
19. `/privacy` — Privacy Policy & Data Protection
20. `/terms` — Terms and Conditions & Honest Proof Standard

---

## 🛡 License & Data Ownership

Users own 100% of their logged habits, reflections, and photographic evidence.
"Consistency creates progress."

# DHANU
